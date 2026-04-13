<script setup>
    import { useAutoAnimate } from '@formkit/auto-animate/vue'

    const [parent] = useAutoAnimate()

    const props = defineProps({
        name: String,
        icon: String,
        cards: {
            type: Array,
            default: () => []
        },
    });

    const isOpen = ref(false);

    const emit = defineEmits('removed');

    const handleEmit = () => {
        emit('removed');
    }

    const selectedCardId = ref(null);

    const handleCardSelection = (id) => {
        selectedCardId.value = id;
    }
</script>

<template>

    <div ref="parent" class="bg-zinc-900 border-[0.15rem] border-zinc-800 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] w-[95%] md:w-3/4 p-[1rem] rounded-lg">
        <div class="flex flex-row place-content-between">
            <div class=" flex flex-row items-center gap-[0.5rem]">
                <img v-if="!error" @error="error = true" :src="props.icon" class="w-[2rem]" alt=""/>
                <div class="text-neutral-600">{{ props.name }}</div>
            </div>
            <div class="w-[2rem] h-[2rem] bg-zinc-700 rounded-full flex justify-center items-center cursor-pointer" @click="isOpen = !isOpen">
                <Icon name="bxs:up-arrow" :class="[isOpen ? 'bg-zinc-500 rotate-180' : 'bg-zinc-500 -rotate-90']"/>
            </div>
        </div>
        <div v-if="isOpen" class="flex gap-[1rem] flex-wrap content-start items-center justify-center mt-[3rem] w-full">
            <wishCard v-for="card in props.cards" :price="card.avgPrice" :globalId="card.globalId" :image="card.image" :localId="card.localId" :name="card.name" :id="card.id" :selectedCardId="selectedCardId" @removed="handleEmit" @selected="handleCardSelection"/>
        </div>
    </div>

</template>