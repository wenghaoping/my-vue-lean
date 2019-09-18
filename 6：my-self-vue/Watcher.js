// 观察者的目的就是给需要变化的那个元素增加观察者
// 观察者, 在数据变化的时候, 观察者中与该属性绑定的回调函数会被调用。
// const watcherHouse = [];

class Watcher {
    constructor (vm, property, callback) {
        this.vm = vm;
        this.property = property;
        this.callback = callback;
        // 先获取一下老的值
        this.value = this.get();
    }

    // 获取其中的值
    _getVal (vm, property) {
        let value = property.split('.'); // [a, b, c]
        return value.reduce((prev, next) => {
            return prev[next];
        }, vm.$data);
    }
    // 获取老的值
    get () {
        Dep.target = this;
        // 在vm中去取值，一定会调用define的get方法
        let value =  this._getVal(this.vm, this.property);
        // 别人再去new的时候，需要清空
        Dep.target = null;
        return value;
    }
    // 对外暴露的方法
    update () {
        let newValue = this._getVal(this.vm, this.property);
        let oldValue = this.value;
        if (newValue !== oldValue) {
            this.callback(newValue); // 对应watch的callback
        }
    }
}
