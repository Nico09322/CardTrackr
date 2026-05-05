<script setup>

    import logo from "@/assets/CardTrackr.svg"
    import { gsap } from "gsap";
    import { navigateTo } from "nuxt/app";
    import { onClickOutside } from '@vueuse/core'
    
    const user = useSupabaseUser();
    const client = useSupabaseClient();
    const showProfile = ref(false);
    const value = ref(null);
    const count = ref(null);
    const showNav = ref(false);
    const profileRef = ref(null);




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

    const logOut = async () => {
        try {
            const {error} = await client.auth.signOut();    
            if (error) throw error;
            showProfile.value = false;
            return navigateTo("/");        
        } catch (error) {
            return
        }
    };

    const fetchData = async () => {
        try {
            const {data, error} = await client.from('collection').select('avgPrice').eq('user_id', user.value.sub);
            if (error) throw error;
            value.value = 0;
            count.value = data.length;
            for (const item of data) {
                value.value += item.avgPrice || 0;
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleClick = () => {
        if(user.value) {
            fetchData();
            showProfile.value = !showProfile.value
        }

    }

    onClickOutside(profileRef, () => showProfile.value = false);

</script>

<template>
    <div class="hidden lg:block">
        <div class="flex justify-center lg:visible">
            <div class="border-b-[0.15rem] border-zinc-700 fixed w-full h-[5rem] bg-zinc-800 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] flex flex-row items-center place-content-between pr-[3rem] pl-[3rem] z-50">
                <div class="flex flex-row items-center gap-[0.5rem]">
                    <div class="bg-red-500 w-[2rem] h-[2rem] rounded-lg flex justify-center items-center shadow-[0_0_15px_#ef4444] shadow-red-500/50"><Icon name="ic:round-check" class="w-[1.5rem] h-[1.5rem] bg-white"/></div>
                    <h1 class="font-bold text-zinc-300">CardTrackr</h1>
                    <div class="text-red-500 border border-red-500 rounded-lg p-[0.5rem] pb-0 pt-0">beta</div>
                </div>
                <div class="flex flex-row gap-[3rem] cursor-pointer select-none items-center">
                    <NuxtLink to="/" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-zinc-100' : 'text-neutral-400', 'hover:text-red-500']" >Home</span>
                    </NuxtLink>
                    <NuxtLink to="/browse" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-zinc-100' : 'text-neutral-400', 'hover:text-red-500']" >Browse</span>
                    </NuxtLink>
                    <NuxtLink to="/wish" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-zinc-100' : 'text-neutral-400', 'hover:text-red-500']" >Wishlist</span>
                    </NuxtLink>
                    <NuxtLink to="/cards" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-zinc-100' : 'text-neutral-400', 'hover:text-red-500']" >My Cards</span>
                    </NuxtLink>
                    <div class="w-[2.5rem] h-[2.5rem] rounded-full bg-zinc-600 flex justify-center items-center group hover:bg-red-500 duration-75" @click="handleClick">
                        <Icon  name="mdi:user" class="bg-zinc-400 w-[1.5rem] h-[1.5rem] group-hover:bg-white duration-75"/>
                    </div>
                </div>
            </div>
            <div v-if="showProfile" ref="profileRef" class="w-[20rem] bg-zinc-800 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg fixed z-20 top-[8rem] left-2/3 p-[1rem] flex flex-col items-center">
                <div class="flex flex-row items-center place-content-between w-[18rem]">
                    <div class="flex flex-row items-center gap-[1rem]">
                        <div class="w-[2.5rem] h-[2.5rem] rounded-full bg-zinc-600 flex justify-center items-center group ">
                            <Icon  name="mdi:user" class="bg-zinc-400 w-[1.5rem] h-[1.5rem]  "/>
                        </div>
                        <div class="text-zinc-400 flex flex-row gap-[0.5rem]">
                            <div>{{ user.email }}</div>
                            <NuxtLink to="/account" class="bg-zinc-600 w-[1.5rem] h-[1.5rem] flex justify-center items-center rounded-full cursor-pointer"><Icon name="material-symbols:edit-outline" class="bg-neutral-400"/></NuxtLink>
                        </div>

                    </div>
                    <div class="bg-red-500 w-[1.5rem] h-[1.5rem] flex justify-center items-center text-white rounded-full group" @click="showProfile = false">
                        <Icon name="fluent-emoji-high-contrast:cross-mark" class="group-hover:rotate-90 duration-100 w-[0.75rem]" />
                    </div>
                </div>
                <div class="w-[18rem] h-[0.1rem] bg-zinc-700 mt-[1rem]"></div>
                <div class="w-[18rem] mt-[1rem] text-neutral-600">
                    <div class="flex flex-row gap-[3rem]">
                        <div class="text-zinc-500">Cards:</div>
                        <div class="text-zinc-400">{{ count }}</div>
                    </div>
                    <div class="flex flex-row gap-[3rem]">
                        <div class="text-zinc-500">Value:</div>
                        <div class="text-neutral-400">{{value.toFixed(2)}}€</div>
                    </div>
                </div>
                <div class="w-[18rem] mt-[1rem]">
                    <div class="bg-red-500 w-[4rem] text-[0.8rem] flex justify-center items-center p-[0.25rem] rounded-lg text-white cursor-pointer" @click="logOut" v-motion="{
                        initial: {
                            scale: 1
                        },
                        hovered: {
                            scale: 1.1
                        },
                        tapped: {
                            scale: 0.9
                        }
                    }"
                    >Log Out</div>
                </div>
            </div>
        </div>
    </div>
   <div class=" lg:hidden">
         <div class="w-[80%] h-[4rem] bg-neutral-600 fixed bottom-4 z-50 rounded-lg left-1/2 -translate-x-1/2">
            <div class="flex flex-row justify-between items-center p-[0.5rem] pr-[1rem] pl-[1rem] h-full">
                <NuxtLink to="/" v-slot="{ isActive }" >

                    <div :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem] ' : 'text-neutral-400 bg-zinc-700 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem]', ]" @click="showNav = false">
                        <Icon class="w-[1rem] h-[1rem]" name="material-symbols:home-outline-rounded"/>
                        <div class="font-bold">HOME</div>
                    </div>
                </NuxtLink>
                <NuxtLink to="/browse" v-slot="{ isActive }" >

                    <div :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem] ' : 'text-neutral-400 bg-zinc-700 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem]', ]" @click="showNav = false">
                        <Icon class="w-[1rem] h-[1rem]" name="material-symbols:browse"/>
                        <div class="font-bold">BROWSE</div>
                    </div>
                </NuxtLink>
                <NuxtLink to="/wish" v-slot="{ isActive }" >

                    <div :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem] ' : 'text-neutral-400 bg-zinc-700 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem]', ]" @click="showNav = false">
                        <Icon class="w-[1rem] h-[1rem]" name="material-symbols:bookmark-outline-rounded"/>
                        <div class="font-bold">WISHLIST</div>
                    </div>
                </NuxtLink>
                <NuxtLink to="/cards" v-slot="{ isActive }" >

                    <div :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem] ' : 'text-neutral-400 bg-zinc-700 p-[0.5rem] rounded-lg text-[0.5rem] flex flex-col justify-center items-center w-[4rem]', ]" @click="showNav = false">
                        <Icon class="w-[1rem] h-[1rem]" name="material-symbols:book-5-rounded"/>
                        <div class="font-bold">MY CARDS</div>
                    </div>
                </NuxtLink>
            </div>
        </div>
   </div>
</template>