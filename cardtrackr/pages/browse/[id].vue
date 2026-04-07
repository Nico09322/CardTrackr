<script setup>
    import TCGdex from "@tcgdex/sdk";
    import { gsap } from "gsap";
    import { onMounted } from "vue";
    import { useRoute } from 'vue-router'

    const route = useRoute()

    const tcgdex = new TCGdex('en');
    const card = ref([]);
    const img = ref(null);
    const set = ref(null);
    const setName = ref(null);
    const render = ref(false);



    const getCard = async () => {
        card.value = await tcgdex.card.get(route.params.id);
        console.log(card.value);
        img.value = card?.value.image + "/high.png";
        set.value = card?.value.set.logo + ".png";
        setName.value = card.value.set.name;
        render.value = true;
    }
    
    onMounted(() => {
        getCard();
    })
    
</script>

<template>
    <div v-if="render" class="w-full h-[100vh] flex flex-row justify-center items-center gap-[5rem]">
        <div class="">
            <div class="flex flex-row w-full gap-[1rem] text-[2rem] place-content-between">
                <div class="font-bold">{{ card?.name }}</div>
                <div class="text-neutral-400">#{{ card?.localId }}</div>
            </div>
            <div class="mt-[1rem]">
                <img :src="img" alt="" class="rounded-xl w-[25rem]"/>

            </div>
        </div>
        <div class="w-[40rem] h-[38.5rem] shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg p-[1rem] ">
            <div class="flex flex-row items-center gap-5 mb-[0.5rem]" 
                
            >
                <img :src="set" alt="" class="max-h-[2.5rem]"v-motion="{
                initial: {scale: 1},
                hovered: {scale: 1.1}
            }"/>
                <div v-if="!set">{{ setName}}</div>
            </div>
            <div v-if="card?.abilities" class="mb-[2rem]">
                <div v-if="card.abilities" class="flex flex-row text-neutral-300 items-center gap-[1rem]">
                    <div>abilities</div>
                    <div class="w-full h-[0.125rem] bg-neutral-200 rounded-lg"></div>
                </div>
                <div v-for="ability in card.abilities" class="ml-[1rem] mt-[0.5rem]">
                    <div class="text-red-500 text-[1.25rem]">{{ ability.name }}</div>
                    <div class="text-neutral-500">{{ ability.effect }}</div>
                </div>
            </div>
            <div class="mb-[2rem]">
                <div class="flex flex-row text-neutral-300 items-center gap-[1rem]">
                    <div>attacks</div>
                    <div class="w-full h-[0.125rem] bg-neutral-200 rounded-lg"></div>
                </div>
                <div v-for="attack in card.attacks" class="ml-[1rem] mt-[0.5rem] flex flex-col">
                    <div class="text-red-500 text-[1.25rem] flex flex-row gap-2">
                        <div>{{ attack.name }}</div>
                        <div class="text-neutral-600">{{ attack.damage }}</div>
                    </div>
                    <div class="text-neutral-500">{{ attack.effect }}</div>
                </div>
            </div>
            <div >
                <div class="flex flex-row text-neutral-300 items-center gap-[1rem] mb-[1rem]">
                    <div>info</div>
                    <div class="w-full h-[0.125rem] bg-neutral-200 rounded-lg"></div>
                </div>
                <div class="bg-white w-[5rem] h-[5rem] flex items-center justify-center rounded-lg shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)]" >
                    <div class="flex flex-row items-center">
                        <div class="text-neutral-600">{{ card.pricing.cardmarket.avg30 }}</div>
                        <Icon class="bg-neutral-500" name="material-symbols:euro-rounded"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>