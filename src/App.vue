<template>
    <canvas id="webgl" ref="canvasRef">浏览器不支持canvas，请切换浏览器重试</canvas>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initMap } from '@/store/initMap'

const canvasRef = ref();
const map = ref();

// 随机生成经纬度 from to
const getRandomPosition = () => {
    const data = []
    for (let i = 0; i < 20; i++) {
        data.push({
            from: {
                lon: (Math.random() * 360) - 180,
                lat: (Math.random() * 180) - 90
            },
            to: {
                lon: (Math.random() * 360) - 180,
                lat: (Math.random() * 180) - 90
            }
        })
    }
    map.value.setData(data)
}

onMounted(() => {
    map.value = initMap({ element: canvasRef.value });
    getRandomPosition()
})
</script>

<style scoped>
#webgl {
    width: 100%;
    height:100vh;
}
</style>
