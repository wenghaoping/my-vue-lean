const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(item=>{
    Object.defineProperty(arrayMethods,item,{
        value:function mutator(){
            //缓存原生方法，之后调用
            const original = arrayProto[item]
            let args = Array.from(arguments)
            original.apply(this,args)
            const ob = this.__ob__
            ob.dep.notify()
        },
    })
})
