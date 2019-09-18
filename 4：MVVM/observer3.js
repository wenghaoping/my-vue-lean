//那么问题来了，谁是订阅者？怎么往订阅器添加订阅者？
// 没错，上面的思路整理中我们已经明确订阅者应该是Watcher, 而且var dep = new Dep();
// 是在 defineReactive方法内部定义的，所以想通过dep添加订阅者，
// 就必须要在闭包内操作，所以我们可以在	getter里面动手脚：

let data = {name: 'hello'};
observe(data);
data.name = 'dmq'; // 哈哈哈，监听到值变化了 kindeng --> dmq

function defineReactive(data, key, val) {
    let dep = new Dep();
    observe(val); // 监听子属性
    Object.defineProperty(data, key, {
        get: function() {
            // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
            Dep.target && dep.addDep(Dep.target);
            return val;
        },
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
    }
};
