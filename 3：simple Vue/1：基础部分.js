// 观察者
function observer(value, cb) {
    Object.keys(value).forEach((key) => defineReactive(value, key, value[key] , cb));
}

function defineReactive (obj, key, val, cb) {
    Object.defineProperty(obj, key, {
        // 仅当设置的属性需要被枚举器（如for..in）访问时设置为true。默认为false。
        enumerable: true,
        // 仅当设置的属性的描述符需要被修改或需要通过delete来删除该属性时，configurable属性设置为true。默认为false。
        configurable: true,
        get: () => {
            /*....依赖收集等....*/
            /*Github:https://github.com/answershuto*/
        },
        set: (newVal) => {
            console.log(newVal);
            cb();/*订阅者收到消息的回调*/
        }
    })
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data, options.render)
    }
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
})

app._data.text = 'text3';
//为了便于理解，首先考虑一种最简单的情况，不考虑数组等情况，
// 代码如上所示。在initData中会调用observe这个函数将Vue的数据设置成observable的。
// 当_data数据发生改变的时候就会触发set，对订阅者进行回调（在这里是render）。

// 那么问题来了，需要对app._data.text操作才会触发set。
// 为了偷懒，我们需要一种方便的方法通过app.text直接设置就能触发set对视图进行重绘。那么就需要用到代理。
