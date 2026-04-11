<script setup>

    import { gsap } from "gsap";

    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const error = ref(false);

    const props = defineProps({
        price: Number,
        globalId: String,
        image: String,
        localId: String,
        name: String,
        selectedCardId: String,
        id: String,
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
    
    const emit = defineEmits(['selected', 'removed']);
    

    const remove = async () => {
        try {
            const {error} = await client.from('collection').delete().eq('id', props.id);
            if(error) throw error;
            console.log("removed", props.id)
            emit('removed', props.id);
        } catch (error) {
            console.log(error);
        }
    }
</script>

<template>
    <div :class="[isSelected ? 'bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[10rem] md:w-[18rem] items-center border-[0.2rem] border-red-500' : 'bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[10rem] md:w-[18rem] duration-200 items-center border-[0.2rem] border-white hover:border-red-500']" @click="handleClick">
        <div class="flex flex-col md:flex-row place-content-between w-full">
            <div class="flex flex-row gap-1">
                <div class="text-[0.75rem] md:text-[1rem] h-[2rem] overflow-clip">{{ props.name }}</div>
                <div class="text-neutral-400">({{ props.localId }})</div>
            </div>
        </div>
        <div class="flex justify-center">
            <div class="group flex justify-center items-center hover:cursor-pointer relative" @click="moreDetail">
                <img v-if="!error" @error="error = true" :src="props.image" class="rounded-lg group-hover: duration-100" alt="">
                <div v-if="!error" class="overflow-hidden text-neutral-900 p-[1rem] flex flex-row justify-between absolute rounded-lg group-hover:bg-neutral-500/50  group-hover:opacity-100 w-full h-full opacity-0 duration-100">
                    <div class="-translate-y-10 group-hover:translate-y-0 delay-75 duration-200 text-green-100 bg-green-400/50 w-fit h-[2rem] p-[0.25rem] rounded-lg border border-green-300">{{ props.price }}€</div>
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
</template>