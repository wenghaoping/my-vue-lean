// 这样我们已经可以监听每个数据的变化了，
// 那么监听到变化之后就是怎么通知订阅者了，
// 所以接下来我们需要实现一个消息订阅器，很简单，维护一个数组，用来收集订阅者，
// 数据变动触发notify，再调用订阅者的update方法，
//那么问题来了，谁是订阅者？怎么往订阅器添加订阅者？
// 没错，上面的思路整理中我们已经明确订阅者应该是Watcher, 而且var dep = new Dep();
// 是在 defineReactive方法内部定义的，所以想通过dep添加订阅者，
// 就必须要在闭包内操作，所以我们可以在	getter里面动手脚：

function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        let me = this;
        Object.keys(data).forEach(function(key) {
            me.convert(key, data[key]);
        });
    },
    convert: function(key, val) {
        this.defineReactive(this.data, key, val);
    },

    defineReactive: function(data, key, val) {
        let dep = new Dep();
        let childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                dep.notify();
            }
        });
    }
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
};


var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },

    depend: function() {
        Dep.target.addDep(this);
    },

    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },
    // 订阅者
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};

Dep.target = null;
