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
        console.log(sortedWishlist.value)
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

    console.log(wishlist.length)

</script>

<template>
    <div v-if="wishlist.length < 1" class="flex justify-center items-center w-full h-[100vh]">
        <div class="text-neutral-500 flex flex-col items-center">
            <div>Nothing wishlisted</div>
            <img :src="pika"  class="w-[5.5rem]"/>
        </div>
    </div>
    <div v-if="wishlist.length > 0" class="flex flex-col items-center mt-[10rem] gap-[1rem] mb-[2rem]">
        <wishedSet v-for="set in sortedWishlist" :name="set.name" :icon="set.icon" :cards="set.cards" @removed="handleReload"/>

    </div>


</template>