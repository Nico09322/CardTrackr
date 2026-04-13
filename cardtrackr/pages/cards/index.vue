<script setup>
import CollectedSet from '~/components/collectedSet.vue';


    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const value = ref(null)
    const count = ref(0)

    const collection = ref([]);
    const sortedCollection = ref(null);

    onMounted(async () => {
        await fetchCards();
        await fetchValue();
        sortedCollection.value = collectionBySet.value;
    })
    
    const fetchCards = async () => {
        try {
            const {data, error} = await client.from('collection').select('*').eq('user_id', user.value.sub);
            if (error) throw error;
            collection.value = data || [];
        } catch (error) {
            console.log(error);
        }
    }

    const fetchValue = async () => {
        try {
            const {data, error} = await client.from('collection').select('avgPrice').eq('user_id', user.value.sub);
            if (error) throw error;
            value.value = 0;
            count.value = data.length;
            for (const item of data) {
                value.value += item.avgPrice || 0;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const collectionBySet = computed(() => {
        const result = {}

        collection.value.forEach(card => {
            const set = card.setName
            if (!result[set]) {
            result[set] = {
                name: set,
                icon: card.setIcon, 
                logo: card.setLogo,
                cards: []
            }
            }
            result[set].cards.push(card)
        })

        return result
    });

    const handleReload = async () => {
        await fetchCards();
        sortedCollection.value = collectionBySet.value;
    }


</script>

<template>
    <div class="flex justify-center items-center flex-col gap-[1rem]">
        <div class=" mt-[10rem] lg:mt-[10rem] w-[95%] md:w-3/4 rounded-lg flex flex-row place-content-between items-center">
            <div class="text-zinc-400 font-bold text-[2rem] flex flex-row items-center gap-[1rem]">
                <div>My Cards</div>

            </div>
            <NuxtLink to="/browse" class="w-[7rem] font-black h-[2rem] bg-red-500 flex justify-center items-center text-zinc-900 rounded-lg cursor-pointer" v-motion="{
                    initial: {
                        scale: 1,
                    },
                    hovered: {
                        scale: 1.1
                    }
                }" 
                
            >+ Add cards</NuxtLink>
        </div>
        <div class="gap-[1rem] flex flex-row w-[95%] md:w-3/4 justify-between">
            <div class="bg-zinc-900 border-[0.15rem] border-zinc-800 flex w-full flex-col p-[1rem] rounded-lg">
                <div class="text-zinc-700 text-[0.9rem]">TOTAL CARDS</div>
                <div class="text-zinc-400 text-[1.5rem] font-bold">{{ collection.length }}</div>
            </div>
            <div class="bg-zinc-900 border-[0.15rem] border-zinc-800 w-full flex flex-col p-[1rem] rounded-lg">
                <div class="text-zinc-700 text-[0.9rem]">SETS</div>
                <div class="text-zinc-400 text-[1.5rem] font-bold">{{ sortedCollection ? Object.keys(sortedCollection).length : 0 }}</div>
            </div>
            <div class="bg-zinc-900 border-[0.15rem] border-zinc-800 w-full flex flex-col p-[1rem] rounded-lg">
                <div class="text-zinc-700 text-[0.9rem]">ESTIMATED VALUE</div>
                <div class="text-zinc-400 text-[1.5rem] font-bold">{{value?.toFixed(2)}}€</div>
            </div>
    </div>
    </div>


    <div v-if="collection.length > 0" class="flex flex-col items-center mt-[3rem] gap-[1rem] mb-[2rem]">
        <CollectedSet v-for="set in sortedCollection" :name="set.name" :icon="set.icon" :logo="set.logo" :cards="set.cards" @removed="handleReload"/>

    </div>
</template>