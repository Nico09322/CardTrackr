<script setup>

    import { gsap } from "gsap";
    import TCGdex, { Query } from '@tcgdex/sdk'

    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const tcgdex = new TCGdex('en');

    const props = defineProps({
        price: Number,
        globalId: String,
        image: String,
        localId: String,
        name: String,
        selectedCardId: String,
        id: String,
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
    
    const emit = defineEmits(['selected', 'removed']);
    
    const isSelected = computed(() => props.selectedCardId === props.id);
    
    const handleClick = () => {
        emit('selected', isSelected.value ? null : props.id);
    }

    const remove = async () => {
        try {
            const {error} = await client.from('wishlist').delete().eq('id', props.id);
            if(error) throw error;
            console.log("removed", props.id)
            emit('removed', props.id);
        } catch (error) {
            console.log(error);
        }
    }

    
    const collectCard = async () => {
        const collectCard = await tcgdex.card.get(props.globalId);
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
                    avgPrice: collectCard.pricing?.cardmarket?.avg,
                    setName: collectCard.set.name,
                    setIcon: icon,
                    setLogo: logo,
                    user_id: user.value.id
                });
            if (error) throw error;
            remove();
        } catch (error) {
            console.log(error);
        }
    }
</script>

<template>
    <div :class="[isSelected ? 'bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[18rem] items-center border-[0.2rem] border-red-500' : 'bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[18rem] items-center border-[0.2rem] border-white hover:border-red-500']" @click="handleClick">
        <div class="flex flex-row place-content-between w-full">
            <div class="flex flex-row gap-1">
                <div>{{ props.name }}</div>
                <div class="text-neutral-400">({{ props.localId }})</div>
            </div>
            <div v-if="props.price">{{ props.price }}€</div>
        </div>
        <img :src="props.image" class="rounded-lg w-[14rem]"/>
        <div v-if="isSelected" class="flex flex-col gap-[0.5rem]">
            <div class="bg-red-500 text-white w-[14rem] flex justify-center items-center rounded-lg p-[0.25rem] cursor-pointer" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText" @click="collectCard">add to collection</div>
            <div class="bg-neutral-400 text-white w-[14rem] flex justify-center items-center rounded-lg p-[0.25rem] cursor-pointer" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText" @click="remove">Remove</div>
        </div>
    </div>
</template>