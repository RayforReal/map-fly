
export default class EventStore {
    constructor(instance) {
        this.initEvent(instance)
    }

    initEvent(instance) {
        const { options } = instance;
        options.element.addEventListener('mousemove', () => {
            console.log('mousemove');
        })
    }
}
