<script setup>
import CollectedSet from '~/components/collectedSet.vue';


    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const collection = ref([]);
    const sortedCollection = ref(null);

    onMounted(async () => {
        await fetchCards();
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
    <div class="flex justify-center">
        <div class="bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[5rem] lg:mt-[10rem] w-[90%] p-[1rem] rounded-lg flex flex-row place-content-between items-center">
            <div class="text-neutral-400 font-bold text-[2rem] flex flex-row items-center gap-[1rem]">
                <div>My Cards</div>
                <NuxtLink to="/browse" class="w-[2rem] h-[2rem] bg-red-500 flex justify-center items-center pb-[0.25rem] text-white rounded-lg cursor-pointer" v-motion="{
                    initial: {
                        scale: 1,
                    },
                    hovered: {
                        scale: 1.1
                    }
                }" 
                
                >+</NuxtLink>
            </div>
            <div class="flex flex-row gap-1 text-[1.25rem]">
                <div class="text-neutral-400">cards:</div>
                <div class="text-red-500">{{ collection.length }}</div>
            </div>
        </div>
    </div>
    <div v-if="collection.length > 0" class="flex flex-col items-center mt-[3rem] gap-[1rem] mb-[2rem]">
        <CollectedSet v-for="set in sortedCollection" :name="set.name" :icon="set.icon" :logo="set.logo" :cards="set.cards" @removed="handleReload"/>

    </div>
</template>