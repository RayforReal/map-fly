export default class EventStore {
    hoverEvent(element: Element) {
        element.addEventListener('mousemove', () => {
            console.log('mousemove');
        })
    }

    resizeEvent(camera, renderer, width, height) {
        // 监听画面变化，更新渲染画面
        window.addEventListener("resize", () => {
            // 更新摄像头
            // aspect属性是设置摄像机视锥体的长宽比，通常是使用画布的宽/画布的高。
            camera.aspect = width / height;
            // 更新摄像机的投影矩阵
            camera.updateProjectionMatrix();
            // 更新渲染器
            renderer.setSize(width, height);
            // 设置渲染器的像素比
            renderer.setPixelRatio(window.devicePixelRatio);
        });
    }
}
