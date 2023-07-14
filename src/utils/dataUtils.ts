import * as THREE from 'three';

/**
 * 经纬度转换为3D坐标
 * @param latitude 经度
 * @param longitude 纬度
 * @param radius 需要转换坐标的圆的半径
 */
export function convertTo3D(latitude, longitude, radius) {
    // 将经纬度转换为弧度
    const phi = (90 - latitude) * Math.PI / 180;
    const theta = (longitude + 180) * Math.PI / 180;
    // 计算在球体上的坐标
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

/**
 * 保留小数位数
 * @param value 需要转换的值
 * @param fixed 默认保留两位小数
 */
export const getNumFixed = (value: string | number, fixed = 2) => {
    return Number(value).toFixed(fixed)
}
