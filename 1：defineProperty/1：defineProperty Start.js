// Object.definedProperty方法可以在一个对象上直接定义一个新的属性、或修改一个对象已经存在的属性，最终返回这个对象。
// 语法  Object.1：defineProperty(obj, prop, descriptor)
// obj 被定义或修改属性的对象；
// prop 要定义或修改的属性名称；
// descriptor 对属性的描述；
// using __proto__

let descriptor = Object.create(null); // no inherited properties

//所有描述符的属性被设置为默认值
descriptor.value = 'static';
Object.defineProperty(obj, 'key', descriptor);
/*
get
属性的getter方法，若属性没有getter方法则为undefined。该方法的返回为属性的值。默认为undefined。

set
属性的setter方法，若属性没有setter方法则为undefined。该方法接收唯一的参数，作为属性的新值。默认为undefined。
在 descriptor 中不能 同时设置访问器 (get 和 set) 和 wriable 或 value，否则会错，
就是说想用(get 和 set)，就不能用（wriable 或 value中的任何一个）
*/
let obj = {};
//明确设置每个描述符的属性
Object.defineProperty(obj, 'key', {
    // 仅当设置的属性需要被枚举器（如for..in）访问时设置为true。默认为false。
    enumerable: false,
    // 仅当设置的属性的描述符需要被修改或需要通过delete来删除该属性时，configurable属性设置为true。默认为false。
    // 总开关，一旦为false，就不能再设置他的（value，writable，configurable
    configurable: false,
    // 仅当属性的值可以被赋值操作修改时设置为true。默认为false。如果为false，属性的值就不能被重写,只能为只读了
    writable: false,
    // 设置属性的值，可以是任何JavaScript值类型（number,object,function等类型）。默认为undefined。当设置后不能设置get和set
    value: 'static'
});

//重用同一个对象作为描述符
function withValue(value) {
    let d = withValue.d || (
        withValue.d = {
            enumerable: false,
            writable: false,
            configurable: false,
            value: null
        }
    );
    d.value = value;
    return d;
}
Object.defineProperty(obj, 'key', withValue('static'));

//如果Object.freeze方法可用，则使用它来防止对对象属性的修改
(Object.freeze || Object)(Object.prototype);
