import * as THREE from 'three';
import { Group, Scene, Vector3 } from 'three';
import config from "../utils/config";
import starsImg from '../assets/images/stars.png';
import earth from '../assets/images/earth.jpg';
import EventStore from "@/utils/eventStore";
import { Options, IData } from '@/store/types';
import { convertTo3D, getNumFixed } from '@/utils/dataUtils';

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
        new EventStore().hoverEvent(this.options.element);
    }

    // 创建圆
    createSphere() {
        this.setBackGround();
        this.setTextureMap();
    }

    // 设置地球地图贴图
    setTextureMap() {
        const geometry = new THREE.SphereGeometry(config.mapRadius, 100, 100);
        const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(earth) });
        this.earth = new THREE.Mesh(geometry, material);
        this.scene.add(this.earth);
    }

    // 设置整个场景背景
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

    // 设置点
    setData(data: IData[]) {
        const pointerGroup = new Group();
        for (let i = 0; i < data.length; i++) {
            const { from, to } = data[i];
            const formPos = convertTo3D(from.lat, from.lon, config.mapRadius - 0.5)
            const toPos = convertTo3D(to.lat, to.lon, config.mapRadius - 0.5);
            pointerGroup.add(this.creatPoint(formPos, 'from'), this.creatPoint(toPos, 'to'));
        }
        this.scene.add(pointerGroup)
    }

    creatPoint(position: Vector3, type: 'from' | 'to') {
        const geometry = new THREE.SphereGeometry(1, 20, 20)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const circle = new THREE.Mesh(geometry, material);
        circle.position.set(position.x, position.y, position.z);
        circle.name = `${type}_${getNumFixed(position.x)}_${getNumFixed(position.y)}_${getNumFixed(position.z)}`;
        return circle
    }
}

