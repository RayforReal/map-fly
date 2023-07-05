import * as THREE from 'three';
import config from "./config";
import { Scene, Group } from 'three';
import { convertTo3D } from './dataUtils';
import worldJson from '../data/world.json';
import starsImg from '../assets/images/stars.png';

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

    // 创建国家线条
    createCountryLine() {
        // 创建线条网格材质
        const material = new THREE.LineBasicMaterial({ color: config.countryLineColor });
        // 遍历国家数据
        worldJson.features.forEach(country => {
            const geometry = new THREE.BufferGeometry();
            if (country.geometry.type === "Polygon") {
                // 提取国家的几何数据
                const positions = country.geometry.coordinates.flat();
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
                // 添加线条网格到场景中
                this.scene.add(line);
            } else {
                const multiPositions = country.geometry.coordinates;
                for (let j = 0; j < multiPositions.length; j++) {
                    const positions = multiPositions[j];
                    // 创建几何体
                    const geometry = new THREE.BufferGeometry();
                    // 创建顶点数组
                    const vertices = [];
                    for (let i = 0; i < positions.length; i++) {
                        const polygon = positions[i];
                        for (let k = 0; k < polygon.length; k++) {
                            const longitude = polygon[k][0];
                            const latitude = polygon[k][1];
                            const vertex = convertTo3D(latitude, longitude, config.mapRadius);
                            vertices.push(vertex.x, vertex.y, vertex.z);
                        }
                    }
                    // 设置几何体的位置属性
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                    // 创建线条网格
                    const line = new THREE.Line(geometry, material);
                    // 添加线条网格到场景中
                    this.scene.add(line);
                }

            }
        });
    }

    transitionCoordinates(coordinates) {
        coordinates.forEach(coordinate => {
            coordinate.forEach(coordinateItem => {
                // 将经纬度转换为三维坐标并将点添加到地球上
                const position = convertTo3D(coordinateItem[0], coordinateItem[0], config.mapRadius);
                const pointGeometry = new THREE.SphereGeometry(0.2, 8, 8);
                const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const point = new THREE.Mesh(pointGeometry, pointMaterial);
                point.position.copy(position);
            })
        })
    }
}

