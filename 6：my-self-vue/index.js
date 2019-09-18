class MVVM {
    // 先将数据挂在到实例上
    constructor (options) {
        // 一般参数
        this.$option = options;
        this.$el = options.el;
        this.$data = options.data();
        this._data = this.$data;
        // 如果有要编译的模板，就开始编译
        if (this.$el) {
            // 数据代理
            // 实现 vm.xxx -> vm._data.xxx
            Object.keys(this.$data).forEach((key) => {
                this._proxyData(key);
            });
            // 计算属性初始化
            this._initComputed();
            // 数据劫持，就是把对象的所有属性，改成get和set方法
            new Observer(this.$data);
            // 用数据和元素进行编译
            this.$compile = new Compile(this.$el || document.body, this);
        }
    }
    // 设置代理函数
    _proxyData (key) {
        Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get () {
                return this._data[key];
            },
            set (newVal) {
                this._data[key] = newVal;
            }
        })
    }
    // 初始化计算属性
    _initComputed() {
        const { computed } = this.$option;
        // 存在计算属性，以及是一个对象
        if (
            computed &&
            Object.prototype.toString.call(computed) === '[object Object]'
        ) {
            Object.keys(computed).forEach(key => {
                if (typeof computed[key] !== 'function') {
                    throw new Error('Must be function!');
                }
                // 当调用vm.computedAttribute的时候，会调用get函数即computed里定义的函数
                Object.defineProperty(this, key, {
                    get: computed[key],
                    set() {},
                });
            });
        }
    }

    $watch (key, cb, options) {
        new Watcher(this, key, cb);
    }
}
