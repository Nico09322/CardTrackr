<script setup>
import { ref, onMounted } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import animURL from '@/assets/trashV2.json'

const lottieRef = ref()

const handleHover = () => {
    lottieRef.value.play();
}

const handleLeave = () => {
    lottieRef.value.goToAndStop(0,true);
}


</script>

<template>
  <client-only>
    <div 
      class="md:w-[8rem] w-[3rem] h-[1.75rem] md:absolute"
      @mouseenter="handleHover"
      @mouseleave="handleLeave"
    >
      <Vue3Lottie
        ref="lottieRef"
        :animationData="animURL"
        :loop="false"
        :autoPlay="false"
        style="width: 24px; height: 24px;"
        class="md:relative right-6"
      />
    </div>
  </client-only>
</template>
