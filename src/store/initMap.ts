import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EarthMap } from './earthMap';

export const initMap = () => {
    // 获取canvas元素
    const canvas = document.getElementById('webgl');

    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set(0, 50, 300)
    scene.add(camera)

    // 添加相机控件
    const controls = new OrbitControls(camera, canvas);
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
    scene.add(new THREE.AmbientLight(0xadadad))
    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(0, 0, 0)
    scene.add(directionLight)

    // 创建XYZ轴的辅助线
    const axisHelper = new THREE.AxesHelper(60);
    scene.add(axisHelper);

    // 创建地图
    const earth = new EarthMap(scene);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置场景颜色
    renderer.setClearColor(new THREE.Color(0xffffff), 1)

    // 设置初始旋转速度和角度
    const rotationSpeed = 0.005;
    let rotationAngle = 0;

    const animate = () => {
        requestAnimationFrame(animate);
        // 更新旋转角度
        rotationAngle += rotationSpeed;
        // 设置球体的旋转
        earth.setRotate(rotationAngle)
        // 渲染场景
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}
