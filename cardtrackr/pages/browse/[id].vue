<script setup>
    import TCGdex from "@tcgdex/sdk";
    import { gsap } from "gsap";
    import { onMounted } from "vue";
    import { useRoute } from 'vue-router'
    import { until } from '@vueuse/core'

    const route = useRoute()

    const tcgdex = new TCGdex('en');
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const card = ref([]);
    const img = ref(null);
    const set = ref(null);
    const setName = ref(null);
    const render = ref(false);
    let trend = 0;
    const isWishlisted = ref(false);
    const wishlist = ref('wishlist')



    const getCard = async () => {
        card.value = await tcgdex.card.get(route.params.id);
        console.log(card.value);
        img.value = card?.value.image + "/high.png";
        set.value = card?.value.set.logo + ".png";
        setName.value = card.value.set.name;
        render.value = true;
        trend = ((card.value.pricing.cardmarket.avg7 - card.value.pricing.cardmarket.avg30) / card.value.pricing.cardmarket.avg30 * 100).toFixed(1)

        const {data} = await client
            .from('wishlist')
            .select('id')
            .eq('globalId', card.value.id)
            .eq('user_id', user.value.sub)

        console.log("wishlist test:", data)
        isWishlisted.value = data.length > 0
        if(isWishlisted.value == true) {
            wishlist.value = "wishlisted"
        }
    }

    
    onMounted(async () => {
        await until(user.value).toBeTruthy()
        getCard();

    })

    const wishCard = async () => {
        if (isWishlisted.value == false) {
            const wishCard = card.value;
            const imgWish = wishCard.image + '/low.jpg'
            const icon = wishCard.set.symbol + '.png';
            try {
                const {error} = await client
                    .from('wishlist')
                    .insert({
                        globalId: wishCard.id,
                        localId: wishCard.localId,
                        image: imgWish, 
                        name: wishCard.name, 
                        avgPrice: wishCard.pricing?.cardmarket?.avg, 
                        setName: wishCard.set.name, 
                        setIcon: icon,
                        user_id: user.value.id
                    });
                if (error) throw error;
                isWishlisted.value = true;
                wishlist.value = "wishlisted"
            } catch (error) {
                console.log(error);
            }
        }

    }
    
</script>

<template>
    <div>
        
    </div>
    <div v-if="render" class="w-full h-[100vh] flex flex-row justify-center items-center gap-[5rem]">
        
        <div class="relative">
            <div>
                <NuxtLink to="/browse" class="w-[6rem] h-[2.5rem] bg-red-500 rounded-lg text-white font-bold flex items-center justify-center gap-[0.75rem] absolute -top-[3rem]" v-motion="{
                    initial: {scale: 1},
                    hovered: {scale:1.1}
                }">
                    <Icon name="weui:back-filled" size="1.5rem"/>
                    <div>back</div>
                </NuxtLink>
            </div>
            <div class="flex flex-row w-full gap-[1rem] text-[2rem] place-content-between">
                <div class="font-bold">{{ card?.name }}</div>
                <div class="text-neutral-400">#{{ card?.localId }}</div>
            </div>
            <div class="mt-[1rem]">
                <img :src="img" alt="" class="rounded-xl w-[25rem]"/>

            </div>
        </div>
        <div class="w-[40rem] shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg p-[1rem] relative">
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
                <div class="bg-white w-full h-[10rem] flex items-center justify-center rounded-lg shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] relative mb-[3.5rem]" >
                    <div class="flex flex-row items-center gap-[1rem] z-20" >
                        <div class="text-neutral-600 flex gap-[0.25rem] items-center justify-end flex-col h-[8rem]">
                            <div class="items-center justify-center flex"></div>
                            <div class="bg-neutral-300 w-[5rem] h-[3.5rem] rounded-lg text-white items-center justify-center flex">{{ card.pricing.cardmarket.avg7 }}<Icon class="bg-white" name="material-symbols:euro-rounded"/></div>
                            <div class="text-neutral-400">7 day ∅</div>
                        </div>
                        <div class="text-neutral-600 flex gap-[0.25rem] items-center justify-end flex-col h-[8rem]">
                            <div class="items-center justify-center flex"></div>
                            <div class="bg-neutral-400 w-[5rem] h-[4.5rem] rounded-lg text-white items-center justify-center flex">{{ card.pricing.cardmarket.avg30 }}<Icon class="bg-white" name="material-symbols:euro-rounded"/></div>
                            <div class="text-neutral-400">30 day ∅</div>
                        </div>
                        <div class="text-neutral-600 flex gap-[0.25rem] items-center justify-end flex-col h-[8rem]">
                            <div class="items-center justify-center flex"></div>
                            <div class="bg-red-500 w-[5rem] h-[6rem] rounded-lg text-white items-center justify-center flex">{{ card.pricing.cardmarket.avg }}<Icon class="bg-white" name="material-symbols:euro-rounded"/></div>
                            <div class="text-neutral-400">all time ∅</div>
                        </div>                        
                    </div>
                    <div class="absolute w-full  flex flex-col gap-[1rem]">
                        <div class="h-[2px] bg-neutral-50"></div>
                        <div class="h-[2px] bg-neutral-50"></div>
                        <div class="h-[2px] bg-neutral-100"></div>
                        <div class="h-[2px] bg-neutral-100"></div>
                        <div class="h-[2px] bg-neutral-200"></div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-[0.5rem] w-[38rem] justify-between absolute bottom-[1rem]">
                <div :class="[!isWishlisted ? 'text-white bg-neutral-400 p-[0.5rem] rounded-lg flex-1 text-center cursor-pointer' : 'text-white bg-neutral-400 p-[0.5rem] rounded-lg flex-1 text-center cursor-pointer opacity-50']" @click="wishCard" v-motion="{
                    initial: {scale: 1},
                    hovered: {scale: 1.04}
                }">{{wishlist}}</div>
                <div class="text-white bg-red-500 p-[0.5rem] rounded-lg flex-1 text-center cursor-pointer">collect</div>
            </div>
        </div>
    </div>
</template>