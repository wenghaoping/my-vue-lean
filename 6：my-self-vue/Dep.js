class Dep {
    constructor () {
        // 订阅的数组
        this.subs = [];
    }
    //添加订阅
    addSub (watcher) {
        // 传一个watcher，每次调用的时候，就Push一个，存起来
        this.subs.push(watcher);
    }
    // 通知
    notify () {
        // 调用每一个watcher的更新方法
        this.subs.forEach((watcher) => {
            watcher.update();
        })
    }
}
