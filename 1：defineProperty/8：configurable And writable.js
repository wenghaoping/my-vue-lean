let a = {};
Object.defineProperty(a, 'o', {
    configurable: false,
    value: 10,
    writable: true
});

console.log(a.o);//10
a.o = 12;//不报错
console.log(a.o);//12

Object.defineProperty(a, 'o', {
    configurable: false,
    value: 14,
    writable: true
});
console.log(a.o);//14

Object.defineProperty(a, 'o', {
    configurable: false,
    value: 14,
    writable: false // true OR false
});
a.o = 16;//不报错
console.log(a.o);//14

//报错
Object.defineProperty(a, 'o', {
    configurable: false,
    value: 16,
    writable: false
});

//由以上代码可以得出结论，对于描述符（descriptor）为数据描述符（data descriptor）的情况：
// 1.使用“.”操作符来设置属性的值永远不会报错，仅当writable为false时无效。
// 2.只要writable为true，不论configurable是否为false，都可以通过Object.defineProperty()来修改value的值。
// 由此得出结论，各大浏览器运营商实现的Object.defineProperty()和标准描述在configurable的定义上稍有偏差。描述符为数据描述符时值的改变与否仅受writable的控制。
