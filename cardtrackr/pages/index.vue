<script setup>

    import { gsap } from "gsap";
    import browse from "@/assets/browse.jpg"
    import myCards from "@/assets/myCards.jpg"
    import wishlist from "@/assets/wishlist.jpg"

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
    <div class="flex flex-col w-full h-[100vh] justify-center items-center font-bold text-[2rem] sm:text-[3rem]">
        <div class="flex flex-row gap-3">
            <div>Your</div>
            <div class="text-red-500">collection</div>
        </div>
        <div>always at a glance</div>
        <NuxtLink to="/browse" class=" select-none bg-red-500 text-white text-[1rem] pt-[1rem] pb-[1rem] pr-[2rem] pl-[2rem] rounded-lg mt-[2rem]" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText">Browse Cards</NuxtLink>


    </div>
    <div class="bg-gradient-to-b from-red-500 to-transparent w-full h-[230vh] opacity-[15%] absolute pointer-events-none -z-10">
            
    </div>
    <div class="w-full flex flex-col items-center">
        <div class="flex flex-col xl:flex-row gap-[5rem] items-center mb-[25rem]">
            <div class="font-bold flex flex-col w-[90%] sm:w-[30rem] ">
                <div class="text-[2rem] sm:text-[3rem] mb-[1rem]">Browse & <span class="text-red-500">Discover</span></div>
                <div class="text-neutral-600 font-medium">
                    Explore and discover new cards for your collection. Browse sets, search by name, and fiind the cards you love with ease.
                </div>
            </div>
            <div>
                <img :src="browse" class="lg:w-[45rem] w-[80vw] rounded-lg shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)]"/>
            </div>
        </div>
        <div class="flex flex-col-reverse xl:flex-row gap-[5rem] items-center mb-[25rem]">
            <div>
                <img :src="wishlist" class="lg:w-[45rem] w-[80vw] rounded-lg shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)]"/>
            </div>
            <div class="font-bold flex flex-col w-[90%] sm:w-[30rem]">
                <div class="text-[2rem] sm:text-[3rem] mb-[1rem]"><span class="text-red-500">Wishlist</span></div>
                <div class="text-neutral-600 font-medium">
                    Save the cards you really want to collect. Keep your must-have cards organized and always within reach.
                </div>
            </div>

        </div>
        <div class="flex flex-col xl:flex-row gap-[5rem] items-center mb-[20rem] xl:mb-[5rem]">
            <div class="font-bold flex flex-col w-[90%] sm:w-[33rem]]">
                <div class="text-[2rem] sm:text-[3rem] mb-[1rem]">Manage your <span class="text-red-500">collection</span></div>
                <div class="text-neutral-600 font-medium">
                   View and manage all the cards you own. Keep your collection up-to-date and easily accessible.
                </div>
            </div>
            <div>
                <img :src="myCards" class="lg:w-[45rem] w-[80vw] rounded-lg shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)]"/>
            </div>
        </div>
    </div>
</template>