<script setup>

    import { gsap } from "gsap";

    const props = defineProps({
        image: String,
        name: String,
        id: String,
        price: String
    });

    const url = ref("");
    const displayName = ref("");
    const displayId = ref("");
    const displayPrice = ref("");
    const error = ref(false);

    onMounted(() => {
    url.value = props.image + '/low.jpg';
    displayName.value = props.name;
    displayId.value = props.id;
    displayPrice.value = props.price;
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

</script>

<template>

    <div class="w-[20rem] h-[28.5rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg p-[1rem] border-[0.15rem] border-white hover:border-red-500">
        <div>
            <div class="flex flex-row gap-1">
                <div class="font-semibold text-neutral-600">{{ displayName }}</div>
                <div class="text-neutral-300">({{ displayId }})</div>
                <div>{{  displayPrice}}</div>

            </div>
            <div class="flex justify-center mt-[1rem]">
                <img v-if="!error" @error="error = true" :src="url" />
                <div v-else class="bg-neutral-200 w-[14.5rem] h-[21rem] rounded-lg animate-pulse"></div>
            </div>
            <div class="mt-[1rem] flex flex-row gap-[0.5rem] justify-center">
                <div class="w-[6rem] h-[2rem] bg-red-500 text-white text-[0.8rem] flex justify-center items-center rounded-lg select-none" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText">Wünschen</div>
                <div class="w-[6rem] h-[2rem] bg-neutral-400 text-white text-[0.8rem] flex justify-center items-center rounded-lg select-none" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText">Hinzufügen</div>            
            </div>

        </div>
    </div>

</template>