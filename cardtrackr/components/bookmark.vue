<script setup>
    import { watch, ref, onMounted } from 'vue';
    import { Vue3Lottie } from 'vue3-lottie'

    import animURL from "@/assets/bookmark/bookmark.json"

    const lottieRef = ref();
    const play = ref(false);
    const ready = ref(false);

    const props = defineProps({
        isWishlisted: Boolean
    })
   

    const toggleAnim = () => {
        play.value = !play.value;    
    };

    watch(play, (newVal) => {
        if(newVal) {
            lottieRef.value.play();
        } else {
            lottieRef.value.stop();
        }
    })

    onMounted(() => {
        ready.value = true;
    })

</script>

<template>
    <client-only>
        <div v-if="!isWishlisted" @click="toggleAnim" class="w-[1.9rem] h-[1.9rem]">
            <Vue3Lottie 
                 
                ref="lottieRef"
                :animationData="animURL"
                :loop="false"
                :autoPlay="false" 
                style="width: 28px; height: 28px;"
            />
        </div>
        <div v-else class="w-[1.9rem] h-[1.9rem]">
            <Vue3Lottie 
                 
                ref="lottieRef"
                :animationData="animURL"
                :loop="false"
                :autoPlay="true" 
                style="width: 28px; height: 28px;"
            />
        </div>
    </client-only>


</template>