// 首先来实现dep,dep主要负责依赖的收集,get时触发收集，set时通知watcher通信：
class Dep{
    constructor () {
        // 存放所有的监听watcher
        this.subs = []
    }

    //添加一个观察者对象
    addSub (Watcher) {
        this.subs.push(Watcher)
    }

    //依赖收集
    depend () {
        //Dep.target 作用只有需要的才会收集依赖
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    // 调用依赖收集的Watcher更新
    notify () {
        const subs = this.subs.slice();
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

// 为Dep.target 赋值
function pushTarget (Watcher) {
    Dep.target = Watcher;
}
