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
    
    const isSelected = computed(() => props.selectedCardId === props.id);
    
    const handleClick = () => {
        emit('selected', isSelected.value ? null : props.id);
    }

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
    <div :class="[isSelected ? 'bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[10rem] md:w-[18rem] items-center border-[0.2rem] border-red-500' : 'bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] p-[1rem] rounded-lg flex flex-col gap-[1rem] w-[10rem] md:w-[18rem] items-center border-[0.2rem] border-white hover:border-red-500']" @click="handleClick">
        <div class="flex flex-col md:flex-row place-content-between w-full">
            <div class="flex flex-row gap-1">
                <div class="text-[0.75rem] md:text-[1rem] h-[2rem] overflow-clip">{{ props.name }}</div>
                <div class="text-neutral-400">({{ props.localId }})</div>
            </div>
            <div v-if="props.price">{{ props.price }}€</div>
        </div>
        <div class="flex justify-center">
            <div class="group flex justify-center items-center hover:cursor-pointer" @click="moreDetail">
                <img v-if="!error" @error="error = true" :src="props.image" class="rounded-lg group-hover:opacity-30 duration-100" alt="">
                <div v-if="!error" class="text-neutral-600 absolute group-hover:opacity-100 opacity-0 duration-100">more details</div>
                <div v-else class="bg-neutral-200 w-[9rem] md:w-[14.5rem] h-[13rem] md:h-[21rem] rounded-lg flex justify-center items-center">
                    <div class="flex flex-col justify-center items-center">
                        <pokeball />
                        <div class="text-[0.8rem] text-neutral-400">no image found</div>                         
                    </div>

                </div>
            </div>
        </div>
        <div v-if="isSelected" class="flex flex-col gap-[0.5rem] w-full">
            <div class="bg-neutral-400 text-white w-full flex justify-center items-center rounded-lg p-[0.25rem] cursor-pointer" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText" @click="remove">Remove</div>
        </div>
    </div>
</template>