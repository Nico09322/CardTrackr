<script setup>

    import TCGdex from "@tcgdex/sdk";
    import { gsap } from "gsap";
    import confetti from 'canvas-confetti';
    
    const router = useRouter()
    
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
        collection: {
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
    const isCollected = ref(false);
    const collectButton = ref(null);

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

        if(props.collection) {
            for (const card of props.collection) {
                if(card.globalId === props.globalID) {
                    isCollected.value = true;
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
        const img = wishCard.image + '/low.jpg'
        const icon = wishCard.set.symbol + '.png';
        try {
            const {error} = await client
                .from('wishlist')
                .insert({
                    globalId: wishCard.id,
                    localId: wishCard.localId,
                    image: img, 
                    name: wishCard.name, 
                    avgPrice: wishCard.pricing?.cardmarket?.avg, 
                    setName: wishCard.set.name, 
                    setIcon: icon,
                    user_id: user.value.id
                });
            if (error) throw error;
            isWishlisted.value = true;
        } catch (error) {
            console.log(error);
        }
    }

    const collectCard = async () => {
        const collectCard = await tcgdex.card.get(props.globalID);
        const img = collectCard.image + '/low.jpg';
        const logo = collectCard.set.logo + '.png';
        const icon = collectCard.set.symbol + '.png';
        try {
            const {error} = await client
                .from('collection')
                .insert({
                    globalId: collectCard.id,
                    localId: collectCard.localId,
                    image: img,
                    name: collectCard.name,
                    avgPrice: collectCard.pricing?.cardmarket?.avg30,
                    setName: collectCard.set.name,
                    setIcon: icon,
                    setLogo: logo,
                    user_id: user.value.id
                });
            if (error) throw error;
            isCollected.value = true;
            if(collectButton.value) confettiPush(collectButton.value);
        } catch (error) {
            console.log(error);
        }
    }

    const moreDetail = () => {
        router.push({path: `/browse/${props.globalID}`})
    }

    const confettiPush = (el) => {
        const rect = el.getBoundingClientRect();

        // Pixel -> relative Koordinaten (0-1)
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 10,
            spread: 360,
            startVelocity: 5,
            colors: ['#ef4444', '#f28c8c', '#f7a6a6', '#fcbaba'],
            shapes: ['circle'],
            origin: {x: x,y: y},
            gravity: 0,
            ticks: 100,
            flat: true,
            scalar: 0.7,

        })
    }

</script>

<template>

    <div class="w-[11rem] md:w-[18rem] h-[19rem] md:h-[26rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg p-[0.5rem] border-[0.2rem] border-white hover:border-red-500">
        <div>
            <div class="flex flex-col md:flex-row place-content-between gap-1">
                <div class="flex flex-row gap-2">
                    <div class="font-semibold text-neutral-600 h-[1.5rem] overflow-hidden">{{ displayName }}</div>
                    <div class="text-neutral-300">#{{ displayId }}</div>
                </div>
                <div class="flex flex-row place-content-center md:place-content-start gap-2">
                    <div :class="[!isWishlisted ? 'md:w-[2rem] w-[4rem] h-[2rem] bg-neutral-500 rounded-lg flex justify-center items-center' : 'md:w-[2rem] w-[4rem] h-[2rem] bg-neutral-400 duration-200 rounded-lg flex justify-center items-center pointer-events-none']" @click="wishCard" v-motion="{initial:{scale:1},hovered:{scale:1.1, transition:{type:'spring',stiffness: 350, mass: 0.1}}}">
                        <bookmark :isWishlisted="isWishlisted"/>
                    </div>
                    <div ref="collectButton" :class="[!isCollected ? 'md:w-[2rem] w-[4rem] h-[2rem] bg-red-500 rounded-lg flex justify-center items-center' : 'md:w-[2rem] w-[4rem] h-[2rem] bg-red-500 opacity-50 duration-200 rounded-lg flex justify-center items-center pointer-events-none']" @click="collectCard" v-motion="{initial:{scale:1},hovered:{scale:1.1, transition:{type:'spring',stiffness: 350, mass: 0.1}}}">
                        <Icon name="ic:round-add" class="w-[1.5rem] h-[1.5rem] text-white"/>
                    </div>
                </div>
                

            </div>
            <div class="flex justify-center mt-[0.5rem] md:mt-[1rem]">
                <div class="group flex justify-center items-center hover:cursor-pointer" @click="moreDetail">
                    <img v-if="!error" @error="error = true" :src="url" class="rounded-lg group-hover:opacity-30 duration-100">
                    <div v-if="!error" class="text-neutral-600 absolute group-hover:opacity-100 opacity-0 duration-100">more details</div>
                    <div v-else class="bg-neutral-200 w-[14.5rem] h-[12rem] md:h-[21rem] rounded-lg flex justify-center items-center">
                        <div class="flex flex-col justify-center items-center">
                            <pokeball />
                            <div class="text-[0.8rem] text-neutral-400">no image found</div>                         
                        </div>

                    </div>
                </div>


            </div>
        </div>
    </div>

</template>