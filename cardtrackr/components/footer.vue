<script setup>

    import logo from "@/assets/CardTrackr.svg"

</script>

<template>

    <div class="w-full h-[15rem] bg-zinc-800 border-t-zinc-700 border-[2px] border-r-0 border-l-0 border-b-0 pl-[5rem] p-[3rem]">
        <div class="text-zinc-500">
            <div>
                <img :scr="logo" class="w-[1rem] " alt=""/>
                <div class="font-bold text-zinc-400">CardTrackr</div>
            </div>
            <div class="mt-[2rem]">
                <div class="text-zinc-600">Email</div>
                <div>info@card-trackr.com</div>
            </div>
        </div>
    </div>
    <div class="w-full h-[1rem] bg-red-500 shadow-[0_0_15px_#ef4444] shadow-red-500/50"></div>
</template>
