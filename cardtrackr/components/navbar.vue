<script setup>

    import logo from "@/assets/CardTrackr.svg"
    import { gsap } from "gsap";
    import { navigateTo } from "nuxt/app";
    
    const user = useSupabaseUser();
    const client = useSupabaseClient();
    const showProfile = ref(false);
    const value = ref(null);
    const count = ref(null);
    const showNav = ref(false);

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

</script>

<template>
    <div class="hidden lg:block">
        <div class="flex justify-center lg:visible">
            <div class="fixed w-2/3 h-[5rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[1rem] rounded-lg flex flex-row items-center place-content-between pr-[3rem] pl-[3rem] z-50">
                <div class="flex flex-row items-center gap-[0.5rem]">
                    <img :src="logo" class="w-[2rem]"/>
                    <h1 class="font-bold">CardTrackr</h1>
                </div>
                <div class="flex flex-row gap-[3rem] cursor-pointer select-none items-center">
                    <NuxtLink to="/" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-neutral-700' : 'text-neutral-400', 'hover:text-red-500']" >Home</span>
                    </NuxtLink>
                    <NuxtLink to="/browse" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-neutral-700' : 'text-neutral-400', 'hover:text-red-500']" >Browse</span>
                    </NuxtLink>
                    <NuxtLink to="/wish" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-neutral-700' : 'text-neutral-400', 'hover:text-red-500']" >Wishlist</span>
                    </NuxtLink>
                    <NuxtLink to="/cards" v-slot="{ isActive }" @mouseenter="growText" @mouseleave="shrinkText">
                        <span :class="[isActive ? 'text-neutral-700' : 'text-neutral-400', 'hover:text-red-500']" >My Cards</span>
                    </NuxtLink>
                    <div class="w-[2.5rem] h-[2.5rem] rounded-full bg-neutral-100 flex justify-center items-center group hover:bg-red-500 duration-75" @click="handleClick">
                        <Icon  name="mdi:user" class="bg-neutral-400 w-[1.5rem] h-[1.5rem] group-hover:bg-white duration-75"/>
                    </div>
                </div>
            </div>
            <div v-if="showProfile" class="w-[20rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg fixed z-20 top-[8rem] left-2/3 p-[1rem] flex flex-col items-center">
                <div class="flex flex-row items-center place-content-between w-[18rem]">
                    <div class="flex flex-row items-center gap-[1rem]">
                        <div class="w-[2.5rem] h-[2.5rem] rounded-full bg-neutral-100 flex justify-center items-center group ">
                            <Icon  name="mdi:user" class="bg-neutral-400 w-[1.5rem] h-[1.5rem]  "/>
                        </div>
                        <div class="text-neutral-700">{{ user.email }}</div>
                    </div>
                    <div class="bg-red-500 w-[1.5rem] h-[1.5rem] flex justify-center items-center text-white rounded-full group" @click="showProfile = false">
                        <Icon name="fluent-emoji-high-contrast:cross-mark" class="group-hover:rotate-90 duration-100 w-[0.75rem]" />
                    </div>
                </div>
                <div class="w-[18rem] h-[0.1rem] bg-neutral-200 mt-[1rem]"></div>
                <div class="w-[18rem] mt-[1rem] text-neutral-600">
                    <div class="flex flex-row gap-[3rem]">
                        <div>Cards:</div>
                        <div class="text-neutral-400">{{ count }}</div>
                    </div>
                    <div class="flex flex-row gap-[3rem]">
                        <div>Value:</div>
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
        <div :class="[showNav == false ? 'flex justify-center delay-200 h-[5rem] duration-200' : 'flex justify-center h-[23rem] duration-200']">
            <div :class="[showNav == false ? 'bg-white w-[90%] h-[5rem] shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] relative rounded-lg mt-[1rem] p-[1rem] after:content-[\'\'] after:absolute after:top-0 after:left-0 after:w-full after:h-[5rem] after:bg-red-500 after:-z-40 after:rounded-lg duration-200 after:delay-100 after:duration-200' : 'bg-white w-[90%] h-[23rem] duration-200 delay-100 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] relative rounded-lg mt-[1rem] p-[1rem] after:content-[\'\'] after:absolute after:top-0 after:left-0 after:w-full after:h-[23rem] after:bg-red-500 after:-z-40 after:rounded-lg after:duration-100']">
                <div class="flex flex-row place-content-between items-center h-[3rem]">
                    <div class="flex flex-row items-center gap-[0.5rem]">
                        <img :src="logo" class="w-[2rem]"/>
                        <h1 class="font-bold">CardTrackr</h1>
                    </div>
                    <div class="flex-col flex w-fit h-fit justify-center items-center leading-none space-y-[-2.25rem] group" @click="showNav = !showNav">
                        <Icon name="clarity:minus-line"  size="3rem" :class="[showNav === false ? 'bg-neutral-600 duration-100' : 'bg-neutral-600 rotate-45 duration-100 translate-y-[0.38rem]']"/>
                        <Icon name="clarity:minus-line"  size="3rem" :class="[showNav === false ? 'bg-neutral-600 duration-100' : 'bg-neutral-600 -rotate-45 duration-100 -translate-y-[0.38rem]']"/>
                    </div>
                </div>
                <div :class="[showNav == false ? 'opacity-0' : 'opacity-100 duration-100 delay-200']">
                    <div :class="[showNav == false ? 'flex flex-col gap-[1.5rem] cursor-pointer select-none  mt-[2rem]' : 'flex flex-col gap-[1.5rem] cursor-pointer select-none  mt-[2rem]']">
                        <NuxtLink to="/" v-slot="{ isActive }" >
                            <span :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg' : 'text-neutral-400 bg-neutral-100 p-[0.5rem] rounded-lg', ]" @click="showNav = false">Home</span>
                        </NuxtLink>
                        <NuxtLink to="/browse" v-slot="{ isActive }" >
                            <span :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg' : 'text-neutral-400 bg-neutral-100 p-[0.5rem] rounded-lg', ]" @click="showNav = false">Browse</span>
                        </NuxtLink>
                        <NuxtLink to="/wish" v-slot="{ isActive }" >
                            <span :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg' : 'text-neutral-400 bg-neutral-100 p-[0.5rem] rounded-lg', ]" @click="showNav = false">Wishlist</span>
                        </NuxtLink>
                        <NuxtLink to="/cards" v-slot="{ isActive }">
                            <span :class="[isActive ? 'text-white bg-red-500 p-[0.5rem] rounded-lg' : 'text-neutral-400 bg-neutral-100 p-[0.5rem] rounded-lg', ]" @click="showNav = false">My Cards</span>
                        </NuxtLink>
                        <div class="w-[18rem] h-[0.1rem] bg-neutral-200"></div>
                        <div class="flex flex-row items-center gap-[0.5rem] text-neutral-500">
                            <div class="w-[2.5rem] h-[2.5rem] rounded-full bg-neutral-100 flex justify-center items-center group hover:bg-red-500 duration-75" @click="handleClick">
                                <Icon  name="mdi:user" class="bg-neutral-400 w-[1.5rem] h-[1.5rem] group-hover:bg-white duration-75"/>
                            </div>
                            <div class="" @click="handleClick">Profile</div>
                        </div>

                    </div>
                </div>
               
                <div v-if="showProfile" class="w-[20rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-lg fixed z-20 top-[25rem] left-[5%] p-[1rem] flex flex-col items-center">
                    <div class="flex flex-row items-center place-content-between w-[18rem]">
                        <div class="flex flex-row items-center gap-[1rem]">
                            <div class="w-[2.5rem] h-[2.5rem] rounded-full bg-neutral-100 flex justify-center items-center group ">
                                <Icon  name="mdi:user" class="bg-neutral-400 w-[1.5rem] h-[1.5rem]  "/>
                            </div>
                            <div class="text-neutral-700">{{ user.email }}</div>
                        </div>
                        <div class="bg-red-500 w-[1.5rem] h-[1.5rem] flex justify-center items-center text-white rounded-full group" @click="showProfile = false">
                            <Icon name="fluent-emoji-high-contrast:cross-mark" class="group-hover:rotate-90 duration-100 w-[0.75rem]" />
                        </div>
                    </div>
                    <div class="w-[18rem] h-[0.1rem] bg-neutral-200 mt-[1rem]"></div>
                    <div class="w-[18rem] mt-[1rem] text-neutral-600">
                        <div class="flex flex-row gap-[3rem]">
                            <div>Cards:</div>
                            <div class="text-neutral-400">{{ count }}</div>
                        </div>
                        <div class="flex flex-row gap-[3rem]">
                            <div>Value:</div>
                            <div class="text-neutral-400">{{value}}€</div>
                        </div>
                    </div>
                    <div class="w-[18rem] mt-[1rem]">
                        <div class="bg-red-500 w-[4rem] text-[0.8rem] flex justify-center items-center p-[0.25rem] rounded-lg text-white cursor-pointer" @mouseenter="growText" @mouseleave="shrinkText" @click="logOut">Log Out</div>
                    </div>
                </div>
            </div>
        </div>
   </div>


</template>