// 其他的方法同理，我们只需要把所有需要实现的方法循环遍历执行即可
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(item => {
    Object.defineProperty(arrayMethods, item, {
        value: function mutator(){
            //缓存原生方法，之后调用
            const original = arrayProto[item];
            // 将arguments转化成数组
            // let args = Array.from(arguments);
            let i = arguments.length;
            const args = new Array(i);
            while (i--) {
                args[i] = arguments[i];
            }
            /*调用原生的数组方法*/
            // args => original
            original.apply(this, args);
            console.log(obArr);
        },
    });
});

function protoAugment (target, src) {
    target.__proto__ = src;
}
// 调用
let obArr = [];
protoAugment(obArr, arrayMethods);

obArr.push(1);
obArr.push(2);
obArr.push(3);
obArr.sort((a, b) => (b - a));
// 1、经过以上的代码可以看出，只会更改我们给定数组(obArr)的相关方法，
// 而不会污染Array的原生方法，因此其他普通数组不受影响。
//
// 2、从新赋值数组的__proto__属性为arrayMethods，
// 而arrayMethods我们从新定义了push，pop等相关属性方法，
// 因此当我们使用数组的push,pop等方法时会调用
// arrayMethods的相关属性方法，
// 达到监听数组变化的能力。
//
// 3、对于不支持__proto__属性的浏览器，
// 直接使用Object.defineProperty从新定义相关属性。
//
// 4、而Vue的实现方法正如上，
// 更改我们需要监听的Array数组属性值（属性值为函数），
// 在监听函数里执行数组的原生方法，
// 并通知所有注册的观察者进行响应式处理。
