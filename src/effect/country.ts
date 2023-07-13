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
                allGroup.push(this.createArea(positions, country.properties.name))
            } else {
                // 多个轮廓国家 中国-台湾
                const multiPositions = country.geometry.coordinates;
                for (let j = 0; j < multiPositions.length; j++) {
                    const positions = multiPositions[j];
                    for (let i = 0; i < positions.length; i++) {
                        allGroup.push(this.createArea(positions[i], country.properties.name))
                    }
                }
            }
        });
        this.scene.add(...allGroup)
    }

    createArea(positions: Position[], countryName: string) {
        // 创建顶点数组
        const vertices = [];
        const indices = [];
        for (let i = 0; i < positions.length; i++) {
            const longitude = positions[i][0];
            const latitude = positions[i][1];
            const vertex = convertTo3D(latitude, longitude, config.mapRadius);
            vertices.push(vertex.x, vertex.y, vertex.z);
            indices.push(i);
        }
        // 添加第一个点的索引形成闭合区域
        indices.push(0);

        const geometryArea = new THREE.BufferGeometry();
        geometryArea.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometryArea.setIndex(indices);

        const materialArea = new THREE.MeshBasicMaterial({ color: config.countryAreaColor });
        const meshArea = new THREE.Mesh(geometryArea, materialArea);

        const countryGroup = new THREE.Group();
        if (countryName) {
            countryGroup.name = `countryGroup-${countryName}`;
        }
        countryGroup.add(meshArea);
        return countryGroup;
    }
}
