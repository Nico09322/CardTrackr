<script setup>

    import { gsap } from "gsap";
    import { onMounted } from "vue";
    import TCGdex, { Query } from '@tcgdex/sdk'

    const tcgdex = new TCGdex('en');

    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const price = ref("N/A")
    const error = ref(false);
    const isCollected = ref(false);
    const collectedCard = ref(null)
    const img = ref("")

    const props = defineProps({
        image: String,
        localId: String,
        name: String,
        globalId: String,
    });

    const collectCard = async () => {
        collectedCard.value = await tcgdex.card.get(props.globalId);
        img.value = collectedCard.value.image + '/low.webp';
        const logo = collectedCard.value.set.logo + '.webp';
        const icon = collectedCard.value.set.symbol + '.webp';
        try {
            const {error} = await client
                .from('collection')
                .insert({
                    globalId: collectedCard.value.id,
                    localId: collectedCard.value.localId,
                    image: img.value,
                    name: collectedCard.value.name,
                    avgPrice: collectedCard.value.pricing?.cardmarket?.avg30,
                    setName: collectedCard.value.set.name,
                    setIcon: icon,
                    setLogo: logo,
                    user_id: user.value.id
                });
            if (error) throw error;
            isCollected.value = true;
            if(collectedCard.value.pricing?.cardmarket?.avg30) {
                price.value = collectedCard.value.pricing?.cardmarket?.avg30
            }
        } catch (error) {
            console.log(error);
        }
    }
        const emit = defineEmits(['removed']);
    

        const remove = async () => {
            try {
                const {error} = await client.from('collection').delete().eq('id', collectedCard.value.id);
                if(error) throw error;
                console.log("removed", collectedCard.value.id)
                emit('removed', collectedCard.value.id);
            } catch (error) {
                console.log(error);
            }
        }
</script>

<template>
    <div v-if="isCollected == true" class="group bg-zinc-900 p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[10rem] md:w-[18rem] duration-200 items-center border-[0.15rem] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800" @click="handleClick">
        <div class="flex flex-col md:flex-row place-content-between w-full">
            <div class="flex flex-row gap-1">
                <div class="text-[0.75rem] text-zinc-300 md:text-[1rem] h-[2rem] overflow-clip">{{ collectedCard?.name }}</div>
                <div class="text-neutral-600">({{ collectedCard?.localId }})</div>
            </div>
        </div>
        <div class="flex justify-center">
            <div class=" flex justify-center items-center hover:cursor-pointer relative" @click="moreDetail">
                <img v-if="!error" @error="error = true" :src="img" class="rounded-lg group-hover:opacity-50 duration-100" alt="">
                <div v-if="!error" class="overflow-hidden text-neutral-900 p-[1rem] flex flex-row justify-between absolute rounded-lg group-hover:opacity-100 w-full h-full opacity-0 duration-100">
                    <div class="-translate-y-10 group-hover:translate-y-0 delay-75 duration-200 text-green-100 bg-green-400/50 w-fit h-[2rem] p-[0.25rem] rounded-lg border border-green-300">{{ price }}€</div>
                    <div class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-red-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-red-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="remove">
                        <Icon name="streamline:delete-1-solid" size="0.75rem" class="bg-red-100"/>
                        <div class="delay-0 text-red-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">remove</div>
                    </div>
                </div>
                <div v-else class="bg-neutral-200 w-[9rem] md:w-[14.5rem] h-[13rem] md:h-[21rem] rounded-lg flex justify-center items-center">
                    <div class="flex flex-col justify-center items-center">
                        <pokeball />
                        <div class="text-[0.8rem] text-neutral-400">no image found</div>                         
                    </div>

                </div>
            </div>
        </div>
    </div>
    <div v-if="isCollected != true" class="bg-zinc-900 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[10rem] md:w-[18rem] duration-200 items-center border-[0.15rem] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800" @click="handleClick">
        <div class="flex flex-col md:flex-row place-content-between w-full">
            <div class="flex flex-row gap-1">
                <div class="text-[0.75rem] text-zinc-300 md:text-[1rem] h-[2rem] overflow-clip">{{ props.name }}</div>
                <div class="text-neutral-600">({{ props.localId }})</div>
            </div>
        </div>
        <div class="flex justify-center">
            <div class="group flex justify-center items-center hover:cursor-pointer relative" @click="moreDetail">
                <img v-if="!error" @error="error = true" :src="props.image" class="grayscale opacity-50 rounded-lg group-hover:opacity-30 duration-100" alt="">
                <div v-if="!error" class="overflow-hidden text-neutral-900 p-[1rem] flex flex-row justify-between absolute rounded-lg   group-hover:opacity-100 w-full h-full opacity-0 duration-100">
                    <div class="-translate-y-20 group-hover:translate-y-0 grop-hover:delay-100 bg-green-500/50 w-[2rem] hover:w-[5rem] duration-200 h-[2rem] p-[0.25rem] border border-green-300 rounded-lg overflow-hidden group/delete flex flex-row justify-center items-center gap-[0.25rem]" @click="collectCard">
                        <Icon name="streamline:add-1-solid" size="0.75rem" class="bg-green-100"/>
                        <div class="delay-0 text-green-100 translate-x-20 group-hover/delete:translate-x-0 hidden group-hover/delete:block duration-200">add</div>
                    </div>
                </div>
                <div v-else class="bg-neutral-200 w-[9rem] md:w-[14.5rem] h-[13rem] md:h-[21rem] rounded-lg flex justify-center items-center">
                    <div class="flex flex-col justify-center items-center">
                        <pokeball />
                        <div class="text-[0.8rem] text-neutral-400">no image found</div>                         
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
