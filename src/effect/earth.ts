import * as THREE from 'three';
import { Scene } from 'three';
import config from "../utils/config";
import starsImg from '../assets/images/stars.png';
import { Country } from "@/effect/country";
import EventStore from "@/utils/eventStore";
import { Options } from '@/store/types';

export class Earth {
    scene: Scene

    options: Options

    earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>

    constructor(scene, options) {
        this.scene = scene
        this.options = options
        this.init();
    }

    init() {
        this.createSphere();
        new Country(this.scene)
        new EventStore().hoverEvent(this.options.element);
    }

    // 创建圆
    createSphere() {
        const geometry = new THREE.SphereGeometry(config.mapRadius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: config.mapColor });
        this.earth = new THREE.Mesh(geometry, material);
        this.scene.add(this.earth);
        this.setBackGround();
    }

    setBackGround() {
        // 设置背景颜色
        this.scene.background = new THREE.Color(0x030311)

        // 使用点材质创建星空效果
        const vertices = [];
        for (let i = 0; i < 500; i++) {
            const vertex = new THREE.Vector3();
            vertex.x = 1000 * Math.random() - 500;
            vertex.y = 1000 * Math.random() - 500;
            vertex.z = 1000 * Math.random() - 500;
            vertices.push(vertex.x, vertex.y, vertex.z)
        }
        // 星空效果
        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(vertices), 3)
        )

        // 加载点材质纹理
        const starsTexture = new THREE.TextureLoader().load(starsImg);
        const starsMaterial = new THREE.PointsMaterial({
            size: 2,
            sizeAttenuation: true,
            color: 0x4d76cf,
            transparent: true,
            opacity: 1,
            map: starsTexture
        })

        // 添加到场景中
        this.scene.add(new THREE.Points(starsGeometry, starsMaterial))
    }
}

