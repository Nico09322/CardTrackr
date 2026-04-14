<script setup>

    import TCGdex from "@tcgdex/sdk";
    import { gsap } from "gsap";
    
    const router = useRouter()
    
    const tcgdex = new TCGdex('en');
    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const props = defineProps({
        image: String,
        name: String,
        id: String,
        price: String,
        globalID: String,
        wishlist: {
            type: Array,
            default: () => []
        },
        collection: {
            type: Array,
            default: () => []
        },
    });

    const url = ref("");
    const displayName = ref("");
    const displayId = ref("");
    const displayPrice = ref("");
    const error = ref(false);
    const isWishlisted = ref(false);
    const isCollected = ref(false);
    const collectButton = ref(null);

    onMounted(() => {
        url.value = props.image + '/low.webp';
        displayName.value = props.name;
        displayId.value = props.id;
        displayPrice.value = props.price;
        
        if(props.wishlist) {
            for (const card of props.wishlist) {
                if(card.globalId === props.globalID) {
                    isWishlisted.value = true;
                }
            }
        }

        if(props.collection) {
            for (const card of props.collection) {
                if(card.globalId === props.globalID) {
                    isCollected.value = true;
                }
            }
        }

    });

    const growText = (e) => {
        gsap.to(e.target, {
            scale: 1.1,
            duration: 0.1,
            ease: "power2.out"
        });
    };

    const shrinkText = (e) => {
        gsap.to(e.target, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out"
        });
    };

    const tapButton = (e) => {
        gsap.to(e.target, {
            scale: 0.9,
            duration: 0.1,
            ease: "power2.out"
        });
    }

    const wishCard = async () => {
        const wishCard = await tcgdex.card.get(props.globalID);
        const img = wishCard.image + '/low.webp'
        const icon = wishCard.set.symbol + '.webp';
        try {
            const {error} = await client
                .from('wishlist')
                .insert({
                    globalId: wishCard.id,
                    localId: wishCard.localId,
                    image: img, 
                    name: wishCard.name, 
                    avgPrice: wishCard.pricing?.cardmarket?.avg, 
                    setName: wishCard.set.name, 
                    setIcon: icon,
                    user_id: user.value.id
                });
            if (error) throw error;
            isWishlisted.value = true;
        } catch (error) {
            console.log(error);
        }
    }

    const collectCard = async () => {
        const collectCard = await tcgdex.card.get(props.globalID);
        const img = collectCard.image + '/low.webp';
        const logo = collectCard.set.logo + '.webp';
        const icon = collectCard.set.symbol + '.webp';
        try {
            const {error} = await client
                .from('collection')
                .insert({
                    globalId: collectCard.id,
                    localId: collectCard.localId,
                    image: img,
                    name: collectCard.name,
                    avgPrice: collectCard.pricing?.cardmarket?.avg30,
                    setName: collectCard.set.name,
                    setIcon: icon,
                    setLogo: logo,
                    user_id: user.value.id
                });
            if (error) throw error;
            isCollected.value = true;
            if(collectButton.value) confettiPush(collectButton.value);
        } catch (error) {
            console.log(error);
        }
    }

    const moreDetail = () => {
        router.push({path: `/browse/${props.globalID}`})
    }

    const confettiPush = (el) => {
        const rect = el.getBoundingClientRect();

        // Pixel -> relative Koordinaten (0-1)
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 10,
            spread: 360,
            startVelocity: 5,
            colors: ['#ef4444', '#f28c8c', '#f7a6a6', '#fcbaba'],
            shapes: ['circle'],
            origin: {x: x,y: y},
            gravity: 0,
            ticks: 100,
            flat: true,
            scalar: 0.7,

        })
    }

</script>

<template>

    <div  class="w-[11rem] duration-200 md:w-[18rem] h-[19rem] md:h-[26rem] bg-zinc-900 rounded-lg p-[0.5rem] border-[0.15rem] border-zinc-700 hover:border-red-500 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] group">
        <div>
            <div class="flex flex-col md:flex-row place-content-between gap-1 items-center">
                <div class="flex flex-row justify-between w-full">
                    <div class="font-semibold text-zinc-300 h-[1.5rem] overflow-hidden">{{ displayName }}</div>
                    <div class="text-zinc-600">#{{ displayId }}</div>
                </div>
            </div>
                <div class="flex justify-center mt-[0.5rem] md:mt-[1rem]">
                    <div class="group flex justify-center items-center hover:cursor-pointer relative overflow-hidden rounded-lg" >
                        <div v-if="!error">
                            <img @error="error = true" :src="url" class="rounded-lg duration-150 hover:scale-105 group-hover:opacity-50">
                        </div>
                        <div v-if="!error" class="absolute w-full h-full flex flex-row justify-between p-[1rem]">
                            <div v-if="!isCollected"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-green-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-green-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="collectCard">
                                <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-green-100" />
                                <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">collect</div>
                            </div>
                            <div v-if="isCollected"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-green-500 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-green-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" >
                                <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-green-100" />
                                <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">collected</div>
                            </div>
                            <div v-if="!isWishlisted"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-zinc-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-zinc-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="wishCard">
                                <Icon name="material-symbols-light:bookmark-outline-rounded" size="1.5rem" class="bg-zinc-100" />
                                <div class="delay-0 text-zinc-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">wishlist</div>
                            </div>
                            <div v-if="isWishlisted"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-zinc-500 w-[2rem] hover:w-fit duration-200 h-[2rem] p-[0.25rem] border border-zinc-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" >
                                <Icon name="material-symbols-light:bookmark-outline-rounded" size="1.5rem" class="bg-zinc-100" />
                                <div class="delay-0 text-zinc-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">wishlisted</div>
                            </div>                            
                        </div>
                        <div v-if="!error"   class="absolute w-full h-full flex flex-row justify-between items-end p-[1rem] top-[2rem]">
                            <div class="translate-y-20 group-hover:-translate-y-[2rem] grop-hover:delay-100 bg-zinc-500/50 w-full duration-200 h-[2rem] p-[0.25rem] border border-zinc-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="moreDetail">
                                <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-zinc-100" />
                                <div  class="delay-0 text-zinc-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">more detail</div>
                            </div>
                        </div>
                        <div v-else-if="error" class="bg-zinc-700 w-[9rem] md:w-[14.5rem] h-[13rem] md:h-[21rem] rounded-lg flex justify-center items-center">
                            <div class="flex flex-col justify-center items-center">
                                <pokeball />
                                <div class="text-[0.8rem] text-zinc-400">no image found</div>                         
                            </div>
                                <div  class="absolute w-full h-full flex flex-row justify-between p-[1rem]">
                                   <div v-if="!isCollected"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-green-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-green-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="collectCard">
                                <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-green-100" />
                                <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">collect</div>
                                </div>
                                <div v-if="isCollected"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-green-500 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-green-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" >
                                    <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-green-100" />
                                    <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">collected</div>
                                </div>
                                <div v-if="!isWishlisted"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-zinc-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-zinc-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="wishCard">
                                    <Icon name="material-symbols-light:bookmark-outline-rounded" size="1.5rem" class="bg-zinc-100" />
                                    <div class="delay-0 text-zinc-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">wishlist</div>
                                </div>
                                <div v-if="isWishlisted"  class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-zinc-500 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-zinc-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]">
                                    <Icon name="material-symbols-light:bookmark-outline-rounded" size="1.5rem" class="bg-zinc-100" />
                                    <div class="delay-0 text-zinc-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">wishlisted</div>
                                </div> 
                            </div>
                        </div>
     
                    </div>


                </div>
        </div>
    </div>

</template>