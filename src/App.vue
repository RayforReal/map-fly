<template>
    <canvas id="webgl">浏览器不支持canvas，请切换浏览器重试</canvas>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { initMap } from '@/store/initMap'

onMounted(() => {
    initMap()
})
</script>
