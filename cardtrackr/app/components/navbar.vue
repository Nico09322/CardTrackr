<script setup>

    import logo from "@/assets/CardTrackr.svg"
    import { gsap } from "gsap";

    const navText = ref(null)

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

</script>

<template>

    <div class="flex justify-center">
        <div class="fixed w-2/3 h-[5rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[1rem] rounded-lg flex flex-row items-center place-content-between pr-[3rem] pl-[3rem]">
            <div class="flex flex-row items-center gap-[0.5rem]">
                <img :src="logo" class="w-[2rem]"/>
                <h1 class="">CardTrackr</h1>
            </div>
            <div class="flex flex-row gap-[3rem] cursor-pointer select-none">
                <div class="text-neutral-400 hover:text-red-500" @mouseenter="growText" @mouseleave="shrinkText">Home</div>
                <div class="text-neutral-400 hover:text-red-500" @mouseenter="growText" @mouseleave="shrinkText">Browse</div>
                <div class="text-neutral-400 hover:text-red-500" @mouseenter="growText" @mouseleave="shrinkText">Wunschliste</div>
                <div class="text-neutral-400 hover:text-red-500" @mouseenter="growText" @mouseleave="shrinkText">Meine Karten</div>
            </div>
        </div>
    </div>


</template>