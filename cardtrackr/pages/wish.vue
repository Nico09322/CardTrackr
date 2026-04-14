<script setup>
    import { onMounted } from 'vue';
    import pika from "@/assets/1.svg"
    import WishCard from '~/components/wishCard.vue';

    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const wishlist = ref([]);
    const sortedWishlist = ref(null);
    const search = ref(null);
    const selectedSet = ref('all')


    onMounted(async () => {
        await fetchCards();
        sortedWishlist.value = wishlistBySet.value;
        console.log(wishlist.value)
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

    const availableSets = computed(() => {
        const sets = new Set()
        wishlist.value.forEach(card => sets.add(card.setName))
        return ['all', ...sets]
    })

    const filteredWishlist = computed(() => {
    return wishlist.value.filter(card => {
        const matchesSearch =
        !search.value ||
        card.name.toLowerCase().includes(search.value.toLowerCase())

        const matchesSet =
        selectedSet.value === 'all' ||
        card.setName === selectedSet.value

        return matchesSearch && matchesSet
    })
    })    



</script>

<template>
    <div class="flex items-center flex-col">
        <div v-if="wishlist.length < 1" class="flex justify-center items-center w-full h-[100vh]">
            <div class="text-neutral-500 flex flex-col items-center">
                <div>Nothing wishlisted</div>
                <img :src="pika"  class="w-[5.5rem]"/>
            </div>
        </div>
        <div v-if="wishlist.length > 0" class="flex justify-center w-[90%] ">
            <div class=" shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[5rem] lg:mt-[10rem] w-[90%] p-[1rem] rounded-lg flex flex-row place-content-between items-center">
                <div class="text-neutral-400 font-bold text-[2rem]">Wishlist</div>
                <div>
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
            </div>
        </div>
        <div v-if="wishlist.length > 0" class="w-[80%]">
            <div class="bg-zinc-900 border-[0.15rem] border-zinc-800 flex w-full flex-col p-[1rem] rounded-lg">
                <div class="text-zinc-700 text-[0.9rem]">TOTAL CARDS</div>
                <div class="text-zinc-400 text-[1.5rem] font-bold">{{ wishlist.length }}</div>
            </div>
        <div class="w-full h-[0.15rem] mt-[1rem] bg-zinc-800"></div>            
        </div>
        <div class="flex mt-[3rem] justify-start flex-row w-[80%]">
            <div class="w-[95%] lg:w-3/4 flex flex-row gap-[1rem]">
                <input v-model="search" placeholder="Seach cards..." class="h-[3rem] rounded-lg pl-[1rem] bg-zinc-800 text-zinc-200 border-[0.15rem] border-zinc-700 outline-none focus:border-red-500 focus:shadow-[0_0_15px_#ef4444] focus:shadow-red-500/50"/>
                <select v-model="selectedSet" class="h-[3rem] bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg px-3">
                    <option v-for="set in availableSets" :key="set" :value="set">
                        {{ set }}
                    </option>
                </select>
            </div>
        </div>        
        <div v-if="wishlist.length > 0" class="flex gap-[1rem] flex-wrap content-start items-center justify-center mt-[1rem] w-[95%] sm:w-[90%]">
            <WishCard v-for="card in filteredWishlist" :key="card.id" :name="card.name" :localId="card.localId" :image="card.image" :globalId="card.globalId" :id="card.id" :price="card.avgPrice" @removed="handleReload"/>
        </div>
    </div>



</template>