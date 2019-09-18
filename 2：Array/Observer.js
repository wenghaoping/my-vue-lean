//获得arrayMethods对象上所有属性的数组
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
// value是需要被观察的数据对象，在构造函数中，会给value增加__ob__属性，作为数据已经被Observer观察的标志。
// 如果value是数组，就使用observeArray遍历value，对value中每一个元素调用observe分别进行观察。
// 如果value是对象，则使用walk遍历value上每个key，对每个key调用defineReactive来获得该key的set/get控制权。
class Observer {
    constructor (value) {
        this.value = value
        // 增加dep属性（处理数组时可以直接调用）
        this.dep = new Dep()
        //将Observer实例绑定到data的__ob__属性上面去，后期如果oberve时直接使用，不需要从新Observer
        //处理数组是也可直接获取Observer对象
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            //处理数组
            const augment = value.__proto__ ? protoAugment : copyAugment
            //此处的 arrayMethods 就是上面使用Object.defineProperty处理过
            augment(value, arrayMethods, arrayKeys)
            // 循环遍历数组children进行oberve
            this.observeArray(value)
        } else {
            //处理对象
            this.walk(value)
        }
    }

    walk (obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            //此处我做了拦截处理，防止死循环，Vue中在oberve函数中进行的处理
            if(keys[i]=='__ob__') return;
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }

    observeArray (items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}
//数据重复Observer
function observe(value){
    if(typeof(value) != 'object' ) return;
    let ob = new Observer(value)
    return ob;
}
// 把对象属性改为getter/setter，并收集依赖
function defineReactive (obj,key,val) {
    const dep = new Dep()
    //处理children
    let childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            console.log(`调用get获取值，值为${val}`)
            const value = val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                }
                //此处是对Array数据类型的依赖收集
                if (Array.isArray(value)) {
                    dependArray(value)
                }
            }
            return value
        },
        set: function reactiveSetter (newVal) {
            console.log(`调用了set，值为${newVal}`)
            const value = val
            val = newVal
            //对新值进行observe
            childOb = observe(newVal)
            //通知dep调用,循环调用手机的Watcher依赖，进行视图的更新
            dep.notify()
        }
    })
}

//辅助方法
function def (obj, key, val) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: true,
        writable: true,
        configurable: true
    })
}

//重新赋值Array的__proto__属性
function protoAugment (target,src) {
    target.__proto__ = src
}
//不支持__proto__的直接修改相关属性方法
function copyAugment (target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}
//收集数组的依赖
function dependArray (value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i]
        e && e.__ob__ && e.__ob__.dep.depend()
        if (Array.isArray(e)) {
            //循环遍历chindren进行依赖收集
            dependArray(e)
        }
    }
}
