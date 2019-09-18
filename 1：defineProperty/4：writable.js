'use strict'
var o = {}; //创建一个对象

Object.defineProperty(o, 'a', {
    value: 37,
    writable: false
});

console.log(o.a); // 37
o.a = 25; //没有错误抛出
//在严格模式下会抛出错误
console.log(o.a); //仍然是37，赋值操作无效
