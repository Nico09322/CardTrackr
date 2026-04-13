<script setup>
    import { onMounted } from 'vue';
    import pika from "@/assets/1.svg"

    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const wishlist = ref([]);
    const sortedWishlist = ref(null);


    onMounted(async () => {
        await fetchCards();
        sortedWishlist.value = wishlistBySet.value;
    })

    const fetchCards = async () => {
        try {
            const {data, error} = await client.from('wishlist').select('*').eq('user_id', user.value.sub);
            if (error) throw error;
            wishlist.value = data || [];
        } catch (error) {
            console.log(error);
        }
    }

    const wishlistBySet = computed(() => {
        const result = {}

        wishlist.value.forEach(card => {
            const set = card.setName
            if (!result[set]) {
            result[set] = {
                name: set,
                icon: card.setIcon, 
                cards: []
            }
            }
            result[set].cards.push(card)
        })

        return result
    })

    const handleReload = async () => {
        await fetchCards();
        sortedWishlist.value = wishlistBySet.value;
    }



</script>

<template>
    <div class="">
        <div v-if="wishlist.length < 1" class="flex justify-center items-center w-full h-[100vh]">
            <div class="text-neutral-500 flex flex-col items-center">
                <div>Nothing wishlisted</div>
                <img :src="pika"  class="w-[5.5rem]"/>
            </div>
        </div>
        <div v-if="wishlist.length > 0" class="flex justify-center">
            <div class="bg-zinc-900 border-[0.15rem] border-zinc-800 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[5rem] lg:mt-[10rem] w-[90%] p-[1rem] rounded-lg flex flex-row place-content-between items-center">
                <div class="text-neutral-400 font-bold text-[2rem]">Wishlist</div>
                <div class="flex flex-row gap-1 text-[1.25rem]">
                    <div class="text-neutral-400">cards:</div>
                    <div class="text-red-500">{{ wishlist.length }}</div>
                </div>
            </div>
        </div>
        <div v-if="wishlist.length > 0" class="flex flex-col items-center mt-[3rem] gap-[1rem] mb-[2rem]">
            <wishedSet v-for="set in sortedWishlist" :name="set.name" :icon="set.icon" :cards="set.cards" @removed="handleReload"/>

        </div>
    </div>



</template>