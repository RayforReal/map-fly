import * as THREE from 'three';
import config from "./config";
import { Scene } from 'three';
import { convertTo3D } from './dataUtils';
import worldJson from '../data/world.json';
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
        this.createPoint();
    }

    // 创建圆
    createSphere() {
        const geometry = new THREE.SphereGeometry(config.mapRadius, config.mapRadius, config.mapRadius);
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
            vertex.x = 800 * Math.random() - 400;
            vertex.y = 800 * Math.random() - 400;
            vertex.z = 800 * Math.random() - 400;
            vertices.push(vertex.x, vertex.y, vertex.z)
        }
    }

    // 创建点
    createPoint() {
        worldJson.features.forEach(item => {
            let countryCoordinates: Position[][][] = [];
            if (item.geometry.type === "Polygon") {
                countryCoordinates.push(item.geometry.coordinates);
            } else if (item.geometry.type === "MultiPolygon") {
                countryCoordinates = item.geometry.coordinates;
            }
            console.log(countryCoordinates);
        })
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
                this.earth.add(point);
            })
        })
    }

    setRotate(value) {
        this.earth.rotation.y = value;
        this.earth.rotation.x = -value;
    }
}

