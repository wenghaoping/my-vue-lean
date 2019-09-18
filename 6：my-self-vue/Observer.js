class Observer {
    constructor (data){
        this.observer(data);
    }

    observer(data) {
        // 只有对象形式才可以劫持
        // 要对这个数据将原有的属性改成set和get形式
        // 判断是否是空，或者是否是对象
        if (!data || Object.prototype.toString.call(data) !== '[object Object]') {
            return;
        }
        // 要将数据一一劫持，先获取到data的key和value
        // return new Observer(data);
        Object.keys(data).forEach((key) => {
            // 劫持 Reactive => 响应式
            this.defineReactive(data, key, data[key]);
            // 深度递归劫持，在此地，新对象不会被劫持，需要set中重新劫持
            this.observer(data[key]);
        })
    }

    // 定义数据劫持（哪个对象，哪个值，值是多少）
    defineReactive (obj, key, value) {
        const that = this;
        // 每个变化的数据，都会对应一个数组，这个数组存放所有的更新操作
        const dep = new Dep();
        // obj.key = value; 默认赋值的时候
        Object.defineProperty(obj, key, {
            configurable: true, // 是否可以删除对象等
            enumerable: true, // 可枚举
            // 取值时调用的方法
            get () {
                // 第一次取值，不会调用，target不存在
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set (newValue) {
                // 如果新值和旧值不相等，则赋值
                if (newValue !== value) {
                    // 如果赋值的新值也是一个对象，需要重新劫持
                    that.observer(newValue);
                    // 当前this不是实例 vm.$data.message
                    value = newValue;
                    // 通知所有人，数据更新了
                    dep.notify();
                }
            }
        })
    }
}
