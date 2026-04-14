<script setup>
import CollectedSet from '~/components/collectedSet.vue';


    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const value = ref(null)
    const count = ref(0)
    const search = ref(null)

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

    const filteredCollection = computed(() => {
        if (!sortedCollection.value) return {}
        if (!search.value) return sortedCollection.value
        
        return Object.fromEntries(
            Object.entries(sortedCollection.value).filter(([key]) =>
            key.toLowerCase().includes(search.value.toLowerCase())
            )
        )
    })

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
                <div class="">My Cards</div>

            </div>
            <NuxtLink to="/browse" class="w-[7rem] font-black h-[2rem] bg-red-500 flex justify-center items-center text-white rounded-lg cursor-pointer shadow-[0_0_15px_#ef4444] shadow-red-500/50" v-motion="{
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
        <div class="w-[95%] lg:w-3/4 h-[0.15rem] bg-zinc-800"></div>
    </div>
    <div class="flex mt-[3rem] justify-center flex-row">
        <div class="w-[95%] lg:w-3/4">
            <input v-model="search" placeholder="Seach sets..." class="h-[3rem] rounded-lg pl-[1rem] bg-zinc-800 text-zinc-200 border-[0.15rem] border-zinc-700 outline-none focus:border-red-500 focus:shadow-[0_0_15px_#ef4444] focus:shadow-red-500/50"/>
        </div>
    </div>
    <div v-if="collection.length > 0" class="flex flex-col items-center mt-[1rem] gap-[1rem]">
        <CollectedSet v-for="set in filteredCollection" :name="set.name" :icon="set.icon" :logo="set.logo" :cards="set.cards" @removed="handleReload"/>

    </div>
</template>