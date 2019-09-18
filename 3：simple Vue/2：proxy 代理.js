class Vue {
    constructor(options) {
        _proxy(options.data, options.render);/*构造函数中*/
    }
}

/*代理*/
function _proxy (data, cb) {
    const that = this;
    Object.keys(data).forEach(key => {
        Object.defineProperty(that, key, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter () {
                return that._data[key];
            },
            set: function proxySetter (val) {
                cb();
                that._data[key] = val;
            }
        })
    });
}

let app = new Vue({
    el: '#app',
    data: {
        text: 'text',
        text2: 'text2'
    },
    render(){
        console.log("render");
    }
});

app.text = 'text3';
// 我们可以在Vue的构造函数constructor中为data执行一个代理proxy。
// 这样我们就把data上面的属性代理到了vm实例上。
