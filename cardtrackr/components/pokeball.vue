<script setup>
    import { watch, ref, onMounted } from 'vue';
    import { Vue3Lottie } from 'vue3-lottie'

    import animURL from "@/assets/Pokeball_Loading.json"

    const lottieRef = ref();

</script>

<template>
    <client-only>
        <div class="w-[5rem] h-[3rem]">
            <Vue3Lottie 
                 
                ref="lottieRef"
                :animationData="animURL"
                :loop="true"
                :autoPlay="true" 
                style="width: 48px; height: 48px;"
            />
        </div>

    </client-only>


</template>