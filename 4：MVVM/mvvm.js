// Observer:观察者 complie:编译/解析
/* Mvvm入口函数
1. 初始化数据
2. 开启观察者模式
3. 开始分析模版 */
function Mvvm(options) {
    this.$options = options || {};
    // 接受参数
    let data = this._data = this.$options.data;
    let me = this;

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function(key) {
        // 实现代理
        me._proxyData(key);
    });

    this._initComputed();

    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)
}

Mvvm.prototype = {
    $watch: function(key, cb, options) {
        new Watcher(this, key, cb);
    },
    // 代理函数
    _proxyData: function(key, setter, getter) {
        let me = this;
        setter = setter ||
            Object.defineProperty(me, key, {
                configurable: false, // 不能再define
                enumerable: true, // 可枚举
                get: function proxyGetter() {
                    return me._data[key];
                },
                set: function proxySetter(newVal) {
                    me._data[key] = newVal;
                }
            });
    },

    _initComputed: function() {
        let me = this;
        let computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: function() {}
                });
            });
        }
    }
};
