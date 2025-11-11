<script setup>

    import logo from "@/assets/CardTrackr.svg"

</script>

<template>

    <div class="w-full h-[15rem] bg-white border-t-neutral-200 border-[2px] border-r-0 border-l-0 border-b-0 pl-[5rem] p-[3rem]">
        <div>
            <div>
                <img :scr="logo" class="w-[1rem] " alt=""/>
                <div class="font-bold">CardTrackr</div>
            </div>
            <div class="mt-[2rem]">
                <div class="text-neutral-400">Email</div>
                <div>info@card-trackr.com</div>
            </div>
        </div>
    </div>
    <div class="w-full h-[1rem] bg-red-500"></div>
</template>
