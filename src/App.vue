<template>
    <canvas id="webgl" ref="canvasRef">浏览器不支持canvas，请切换浏览器重试</canvas>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initMap } from '@/store/initMap'

const canvasRef = ref();
onMounted(() => {
    initMap({ element: canvasRef.value })
})
</script>
