<script setup>
import { onMounted } from 'vue';
import CollectedCard from './collectedCard.vue';
import TCGdex, { Query } from '@tcgdex/sdk'

    const tcgdex = new TCGdex('en');
    const set = ref([]);


    const props = defineProps({
        name: String,
        icon: String,
        logo: String,
        cards: {
            type: Array,
            default: () => []
        },
    });

    onMounted(() => {
        fetchSet()
    })

    const fetchSet = async () => {
        set.value = await tcgdex.set.get(props.name);
    }

    const isOpen = ref(false);

    const emit = defineEmits('removed');

    const handleEmit = () => {
        emit('removed');
    }

</script>

<template>

    <div class="bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] w-[95%] md:w-3/4 p-[1rem] rounded-lg">
        <div class="flex flex-row place-content-between">
            <div class=" flex flex-row items-center gap-[0.5rem]">
                <img v-if="!error" @error="error = true" :src="props.logo" class="max-w-[5rem]" alt=""/>
                <div class="text-neutral-600 font-bold">{{ props.name }}</div>
                <div class="text-neutral-400">({{props.cards.length}}/{{ set.cardCount?.total }})</div>
            </div>
            <div class="w-[2rem] h-[2rem] bg-neutral-200 rounded-full flex justify-center items-center cursor-pointer" @click="isOpen = !isOpen">
                <Icon name="bxs:up-arrow" :class="[isOpen ? 'bg-neutral-400 rotate-180' : 'bg-neutral-400 -rotate-90']"/>
            </div>
        </div>
        <div v-if="isOpen" class="flex gap-[1rem] flex-wrap content-start items-center justify-center mt-[3rem] w-full">
            <collectedCard v-for="card in props.cards" :price="card.avgPrice" :globalId="card.globalId" :image="card.image" :localId="card.localId" :name="card.name" :id="card.id" @removed="handleEmit"/>
        </div>
    </div>

</template>