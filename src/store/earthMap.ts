import * as THREE from 'three';
import config from "./config";
import { Scene, Group } from 'three';
import { convertTo3D } from './dataUtils';
import worldJson from '../data/world.json';
import starsImg from '../assets/images/stars.png';
import { Position } from "geojson";

export class EarthMap {
    scene: Scene

    earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>

    constructor(scene) {
        this.scene = scene
        this.init()
    }

    init() {
        this.createSphere();
        this.createCountryLine();
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

    // 创建国家轮廓
    createCountryLine() {
        const allGroup:Group[] = []
        // 遍历国家数据
        worldJson.features.forEach(country => {
            // 单轮廓国家
            if (country.geometry.type === "Polygon") {
                const positions = country.geometry.coordinates.flat();
                allGroup.push(this.createLine(positions, country.properties.name))
            } else {
                // 多个轮廓国家 中国-台湾
                const multiPositions = country.geometry.coordinates;
                for (let j = 0; j < multiPositions.length; j++) {
                    const positions = multiPositions[j];
                    for (let i = 0; i < positions.length; i++) {
                        allGroup.push(this.createLine(positions[i], country.properties.name))
                    }
                }
            }
        });
        this.scene.add(...allGroup)
    }

    createLine(positions:Position[], countryName:string) {
        // 创建几何体
        const geometry = new THREE.BufferGeometry();
        // 创建线条网格材质
        const material = new THREE.LineBasicMaterial({ color: config.countryLineColor });
        // 创建顶点数组
        const vertices = [];
        for (let i = 0; i < positions.length; i++) {
            const longitude = positions[i][0];
            const latitude = positions[i ][1];
            const vertex = convertTo3D(latitude, longitude, config.mapRadius);
            vertices.push(vertex.x, vertex.y, vertex.z);
        }
        // 设置几何体的位置属性
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        // 创建线条网格
        const line = new THREE.Line(geometry, material);
        const countryGroup = new Group();
        if (countryName) {
            countryGroup.name = `countryGroup-${countryName}`;
        }
        countryGroup.add(line)
        return countryGroup;
    }
}

