class Watcher{
    constructor(vm, expOrFn, cb, options){
        //传进来的对象 例如Vue
        this.vm = vm
        //在Vue中cb是更新视图的核心，调用diff并更新视图的过程
        this.cb = cb
        //收集Deps，用于移除监听
        this.newDeps = []
        this.getter = expOrFn
        //设置Dep.target的值，依赖收集时的watcher对象
        this.value =this.get()
    }

    get(){
        //设置Dep.target值，用以依赖收集
        pushTarget(this)
        const vm = this.vm
        let value = this.getter.call(vm, vm)
        return value
    }

    //添加依赖
    addDep (dep) {
        // 这里简单处理，在Vue中做了重复筛选，即依赖只收集一次，不重复收集依赖
        this.newDeps.push(dep)
        dep.addSub(this)
    }

    //更新
    update () {
        this.run()
    }

    //更新视图
    run(){
        //这里只做简单的console.log 处理，在Vue中会调用diff过程从而更新视图
        console.log(`这里会去执行Vue的diff相关方法，进而更新数据`)
    }
}
