<script setup>
    import { computed, onMounted } from 'vue';
    import CollectedCard from './collectedCard.vue';
    import TCGdex, { Query } from '@tcgdex/sdk'
    import MissingCard from './missingCard.vue';
    import { useAutoAnimate } from '@formkit/auto-animate/vue'

    const [parent] = useAutoAnimate()

    const tcgdex = new TCGdex('en');
    const set = ref([]);
    const showUnowned = ref(false);
    const percentage = ref(0)


    const props = defineProps({
        name: String,
        icon: String,
        logo: String,
        cards: {
            type: Array,
            default: () => []
        },
    });

    

    const sortedCards = computed(() => {
        return [...props.cards].sort((a, b) =>
            parseInt(a.localId) - parseInt(b.localId))
    })

    const missingCards = computed(() => {
        if(!set.value?.cards) return [];
        const collectedIds = new Set(props.cards.map(c => c.localId));
        return set.value.cards
            .filter(card => !collectedIds.has(card.localId))
            .sort((a,b) => parseInt(a.localId) - parseInt(b.localId));
    })

    const allCards = computed(() => {
    if (!set.value?.cards) return [];
    const collectedMap = new Map(props.cards.map(c => [c.localId, c]));
    return set.value.cards
        .sort((a, b) => parseInt(a.localId) - parseInt(b.localId))
        .map(card => ({
            ...card,
            collected: collectedMap.has(card.localId),
            collectedData: collectedMap.get(card.localId) ?? null
        }));
});

    onMounted(() => {
        fetchSet()
    })

    const fetchSet = async () => {
        set.value = await tcgdex.set.get(props.name);
        percentage.value = (props.cards.length / set.value.cardCount.total) * 100
    }

    const isOpen = ref(false);

    const emit = defineEmits('removed');

    const handleEmit = () => {
        emit('removed');
    }

</script>

<template>

    <div ref="parent" class="bg-zinc-900 border-[0.15rem] border-zinc-800 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] w-[95%] md:w-3/4 p-[1rem] rounded-lg">
        <div class="flex flex-row place-content-between">
            <div class=" flex flex-row items-center gap-[1rem]">
                <img v-if="!error" @error="error = true" :src="props.logo" class="max-h-[2rem]" alt=""/>
                <div class="felx flex-col duration-200">
                    <div class="text-neutral-400 font-bold text-[1.5rem]">{{ props.name }}</div>
                    <div v-if="isOpen" class="text-zinc-400 flex flex-row gap-[.3rem]">{{props.cards.length}} <div class="text-zinc-600">out of</div> {{ set.cardCount?.total }} <div class="text-zinc-600">collected</div></div>
                </div>

            </div>
            <div class="flex flex-row gap-[1rem] items-center">
               <div class="flex flex-row gap-[0.5rem] text-zinc-500">
                    <div class="text-zinc-300">{{ percentage.toFixed(2) }}%</div>
                    <div >completed</div>
               </div>
                <div class="w-[2rem] h-[2rem] bg-zinc-700 rounded-full flex justify-center items-center cursor-pointer" @click="isOpen = !isOpen">
                    <Icon name="bxs:up-arrow" :class="[isOpen ? 'bg-zinc-500 rotate-180' : 'bg-zinc-500 -rotate-90']"/>
                </div>
            </div>
           
        </div>
        <div v-if="isOpen" class="flex justify-end mt-[2rem]">
            <button  @click="showUnowned = !showUnowned" class=" h-[2rem] text-[0.75rem] px-[0.5rem] py-[0.25rem] rounded-lg border-[0.15rem] duration-200" :class="showUnowned ? 'bg-red-500 text-white border-red-500' : 'bg-zinc-600 text-neutral-400 border-zinc-400 hover:border-red-500'"> show unowned </button>
        </div >   
        <div v-if="isOpen" class="inline-flex gap-[0.5rem] flex-wrap content-start items-center justify-center mt-[1rem] rounded-lg ">  
            <template v-if="showUnowned" v-for="card in allCards" :key="card.localId">
                <collectedCard v-if="card.collected" :price="card.collectedData.avgPrice" :globalId="card.collectedData.globalId" :image="card.collectedData.image" :localId="card.collectedData.localId" :name="card.collectedData.name" :id="card.collectedData.id" @removed="handleEmit"/>
                <MissingCard v-else :name="card.name" :localId="card.localId" :globalId="card.id" :image="`${card.image}/low.webp`" />
            </template>
            <template v-else>
                <collectedCard v-for="card in sortedCards" :price="card.avgPrice" :globalId="card.globalId" :image="card.image" :localId="card.localId" :name="card.name" :id="card.id" @removed="handleEmit"/>
            </template>
        </div>
    </div>
</template>