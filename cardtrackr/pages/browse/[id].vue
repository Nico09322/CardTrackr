<script setup>
    import TCGdex from "@tcgdex/sdk";
    import { gsap } from "gsap";
    import { useRoute } from 'vue-router'

    const route = useRoute()

    const tcgdex = new TCGdex('en');
    const card = ref([]);
    const img = ref(null);



    const getCard = async () => {
        card.value = await tcgdex.card.get(route.params.id);
        console.log(card.value);
        img.value = card.value.image + "/high.png";
    }
    
    getCard();   
    


</script>

<template>
    <div class="w-full h-[100vh] flex flex-row justify-center items-center gap-[5rem]">
        <div class="">
            <div class="flex flex-row w-full gap-[1rem] text-[2rem] place-content-between">
                <div class="font-bold">{{ card.name }}</div>
                <div class="text-neutral-400">#{{ card.localId }}</div>
            </div>
            <div class="mt-[1rem]">
                <img :src="img" alt="" class="rounded-xl w-[25rem]"/>
            </div>
        </div>
        <div class="w-[40rem] h-[38.5rem] shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg"></div>
    </div>
</template>