<script setup>

    import { gsap } from "gsap";

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
    <div class="bg-gradient-to-t from-red-500 to-transparent w-full h-[100vh] opacity-[15%] absolute pointer-events-none"></div>
    <div class="flex flex-col w-full h-[100vh] justify-center items-center font-bold text-[3rem]">
        <div class="flex flex-row gap-3">
            <div>Deine</div>
            <div class="text-red-500">Sammlung</div>
        </div>
        <div>immer im Überblick</div>
        <NuxtLink to="/browse" class=" select-none bg-red-500 text-white text-[1rem] pt-[1rem] pb-[1rem] pr-[2rem] pl-[2rem] rounded-lg mt-[2rem]" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText">Finde Karten</NuxtLink>
    </div>
</template>