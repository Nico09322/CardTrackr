<script setup>

import { gsap } from "gsap";
import TCGdex, { Query } from '@tcgdex/sdk'
import { onMounted } from "vue";

const client = useSupabaseClient();
const user = useSupabaseUser();
const url = ref(null);
const error = ref(false);

const tcgdex = new TCGdex('en');

const props = defineProps({
    price: Number,
    globalId: String,
    image: String,
    localId: String,
    name: String,
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

onMounted(() => {
    url.value = props.image;
})

const emit = defineEmits(['removed']);


const remove = async () => {
    try {
        const { error } = await client.from('wishlist').delete().eq('id', props.id);
        if (error) throw error;
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
        const { error } = await client
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
    <div class="bg-zinc-900 group hover:bg-zinc-800 duration-200 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[11rem] md:w-[18rem] items-center border-[0.15rem] border-zinc-800 hover:border-zinc-700">
        <div class="flex flex-col md:flex-row place-content-between w-full">
            <div class="flex flex-row justify-between w-full">
                <div class="text-zinc-300">{{ props.name }}</div>
                <div class="text-zinc-600">#{{ props.localId }}</div>
            </div>
        </div>
        <div class="flex justify-center">
            <div
                class="group flex justify-center items-center hover:cursor-pointer relative rounded-lg overflow-hidden">
                <img v-if="!error" @error="error = true" :src="url"
                    class="rounded-lg group-hover:opacity-50 duration-200" alt="" />
                <div v-if="!error" class="absolute w-full h-full p-[1rem] flex flex-row justify-between">
                    <div class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-green-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-green-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="collectCard">
                        <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-green-100" />
                        <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">collect</div>
                    </div>
                    <div class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-red-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-red-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="remove">
                        <Icon name="streamline:delete-1-solid" size="0.75rem" class="bg-green-100" />
                        <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">remove</div>
                    </div>
                </div>
                <div v-else class="bg-neutral-200 w-[9rem] md:w-[14.5rem] h-[13rem] md:h-[21rem] rounded-lg flex justify-center items-center">
                    <div class="flex flex-col justify-center items-center">
                        <pokeball />
                        <div class="text-[0.8rem] text-neutral-400">no image found</div>
                    </div>
                    <div  class="absolute w-full h-full p-[1rem] flex flex-row justify-between">
                        <div class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-green-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-green-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="collectCard">
                            <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-green-100" />
                            <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">collect</div>
                        </div>
                        <div class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-red-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-red-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="remove">
                            <Icon name="streamline:delete-1-solid" size="0.75rem" class="bg-green-100" />
                            <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">remove</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>