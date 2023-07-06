import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Earth } from '@/effect/earth';
import EventStore from "@/utils/eventStore";

export const initMap = options => {
    // 获取canvas元素
    const canvas = document.getElementById('webgl');

    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 创建一个根容器对象
    const root = new THREE.Object3D();
    root.add(scene);

    // 设置相机位置和目标点
    camera.position.set(0, 0, 300);
    camera.lookAt(scene.position);

    // 添加相机控件
    const controls = new OrbitControls(camera, canvas!);
    // 是否有惯性
    controls.enableDamping = true;
    // 是否可以缩放
    controls.enableZoom = true;
    // 最近和最远距离
    controls.minDistance = 100;
    controls.maxDistance = 2000;
    // 开启右键拖动
    controls.enablePan = true;
    // 添加灯光
    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(2000, 2000, 3000);
    scene.add(directionLight)

    // 创建XYZ轴的辅助线
    const axisHelper = new THREE.AxesHelper(60);
    scene.add(axisHelper);

    // 创建地球
    new Earth(scene, options);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置场景颜色
    renderer.setClearColor(new THREE.Color(0xffffff), 1)

    // 添加监听窗口变化事件
    new EventStore().resizeEvent(camera, renderer);
    const animate = () => {
        requestAnimationFrame(animate);
        // 整个场景旋转
        // scene.rotation.y -= 0.002;
        // scene.rotation.z -= 0.002;
        // 渲染场景
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}
