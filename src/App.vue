<template>
    <canvas id="webgl" ref="canvasRef">浏览器不支持canvas，请切换浏览器重试</canvas>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initMap } from '@/store/initMap'

const canvasRef = ref();
const map = ref();
onMounted(() => {
    map.value = initMap({ element: canvasRef.value });
    map.value.setData([
        {
            from: {
                id: 1,
                lon: 112.45,
                lat: 34.62
            },
            to: {
                id: 2,
                lon: 14,
                lat: 52
            }
        }
    ])
})
</script>

<style scoped>
#webgl {
    width: 1000px;
    height: 1000px;
}
</style>
