<script setup>

    import TCGdex from "@tcgdex/sdk";
    import { gsap } from "gsap";
    
    const tcgdex = new TCGdex('en');
    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const props = defineProps({
        image: String,
        name: String,
        id: String,
        price: String,
        globalID: String,
        wishlist: {
            type: Array,
            default: () => []
        },
    });

    const url = ref("");
    const displayName = ref("");
    const displayId = ref("");
    const displayPrice = ref("");
    const error = ref(false);
    const isWishlisted = ref(false);

    console.log(props.wishlist)

    onMounted(() => {
        url.value = props.image + '/low.jpg';
        displayName.value = props.name;
        displayId.value = props.id;
        displayPrice.value = props.price;
        
        if(props.wishlist) {
            for (const card of props.wishlist) {
                if(card.globalId === props.globalID) {
                    isWishlisted.value = true;
                }
            }
        }

    });

    const growText = (e) => {
        gsap.to(e.target, {
            scale: 1.1,
            duration: 0.1,
            ease: "power2.out"
        });
    };

    const shrinkText = (e) => {
        gsap.to(e.target, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out"
        });
    };

    const tapButton = (e) => {
        gsap.to(e.target, {
            scale: 0.9,
            duration: 0.1,
            ease: "power2.out"
        });
    }

    const wishCard = async () => {
        const wishCard = await tcgdex.card.get(props.globalID);
        console.log(wishCard);
        const img = wishCard.image + '/low.jpg'
        const icon = wishCard.set.symbol + '/low.jpg';
        try {
            const {error} = await client
                .from('wishlist')
                .insert({
                    globalId: wishCard.id,
                    localId: wishCard.localId,
                    image: img, 
                    name: wishCard.name, 
                    avgPrice: wishCard.pricing?.cardmarket?.avg30, 
                    setName: wishCard.set.name, 
                    setIcon: icon, user_id: 
                    user.value.id});
            if (error) throw error;
            isWishlisted.value = true;
        } catch (error) {
            console.log(error);
        }
    }

</script>

<template>

    <div class="w-[20rem] h-[28.5rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg p-[1rem] border-[0.2rem] border-white hover:border-red-500">
        <div>
            <div class="flex flex-row gap-1">
                <div class="font-semibold text-neutral-600">{{ displayName }}</div>
                <div class="text-neutral-300">({{ displayId }})</div>
                <div>{{  displayPrice}}</div>

            </div>
            <div class="flex justify-center mt-[1rem]">
                <img v-if="!error" @error="error = true" :src="url" />
                <div v-else class="bg-neutral-200 w-[14.5rem] h-[21rem] rounded-lg animate-pulse"></div>
            </div>
            <div class="mt-[1rem] flex flex-row gap-[0.5rem] justify-center">
                <div :class="[isWishlisted === false ? 'w-[6rem] h-[2rem] bg-red-500 text-white text-[0.8rem] flex justify-center items-center rounded-lg select-none' : 'opacity-30 pointer-events-none w-[6rem] h-[2rem] bg-red-500 text-white text-[0.8rem] flex justify-center items-center rounded-lg select-none']" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText" @click="wishCard">Wünschen</div>
                <div class="w-[6rem] h-[2rem] bg-neutral-400 text-white text-[0.8rem] flex justify-center items-center rounded-lg select-none" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText">Hinzufügen</div>            
            </div>

        </div>
    </div>

</template>