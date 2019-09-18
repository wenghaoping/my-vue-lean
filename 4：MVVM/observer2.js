// 这样我们已经可以监听每个数据的变化了，
// 那么监听到变化之后就是怎么通知订阅者了，
// 所以接下来我们需要实现一个消息订阅器，很简单，维护一个数组，用来收集订阅者，
// 数据变动触发notify，再调用订阅者的update方法，

let data = {name: 'hello'};
observe(data);
data.name = 'dmq'; // 哈哈哈，监听到值变化了 kindeng --> dmq

function defineReactive(data, key, val) {
    let dep = new Dep();
    observe(val); // 监听子属性

    Object.defineProperty(data, key, {
        // ... 省略
        set: function(newVal) {
            if (val === newVal) return;
            console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
            val = newVal;
            dep.notify(); // 通知所有订阅者
        }
    });
}

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach((key) => {
        defineReactive(data, key, data[key]);
    });
};

// 消息订阅器
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    // 通知所有订阅者
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    },
    test: function () {
        console.log(123);
    }
};
