import { Group, Scene } from "three";
import worldJson from "@/data/world.json";
import { Position } from "geojson";
import * as THREE from "three";
import config from "@/utils/config";
import { convertTo3D } from "@/utils/dataUtils";

export class Country {
    scene: Scene

    constructor(scene) {
        this.scene = scene
        this.createCountryLine()
    }

    // 创建国家轮廓
    createCountryLine() {
        const allGroup: Group[] = []
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

    createLine(positions: Position[], countryName: string) {
        // 创建几何体
        const geometry = new THREE.BufferGeometry();
        // 创建线条网格材质
        const material = new THREE.LineBasicMaterial({ color: config.countryLineColor });
        // 创建顶点数组
        const vertices = [];
        for (let i = 0; i < positions.length; i++) {
            const longitude = positions[i][0];
            const latitude = positions[i][1];
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
        countryGroup.add(line);
        this.createShapeGeometry(vertices)
        return countryGroup;
    }

    createShapeGeometry(vertices) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.MeshPhongMaterial({
            color: 'red',
            side: THREE.BackSide
        });
        this.scene.add(new THREE.Mesh(geometry, material))
    }
}
