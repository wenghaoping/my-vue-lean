let o = {}; //创建一个对象

//使用数据描述符来为对象添加属性
Object.defineProperty(o, 'a', {
    value: 37,
    writable: true,
    enumerable: true,// 仅当设置的属性需要被枚举器（如for..in）访问时设置为true。默认为false。
    configurable: true// 仅当设置的属性的描述符需要被修改或需要通过delete来删除该属性时，configurable属性设置为true。默认为false。总开关，一旦为false，就不能再设置他的（value，writable，configurable
});
//属性”a”被设置到对象o上，并且值为37

//使用访问器描述符来为对象添加属性
let bValue = 38;
Object.defineProperty(o, 'b', {
    get: () => { return bValue; },
    set: (newValue) => { bValue = newValue; },
    enumerable: true,
    configurable: true
});
console.log(Object.keys(o));// 打印[ 'a', 'b' ] enumerable
console.log(o.b); // 38
//属性”b”被设置到对象o上，并且值为38。
//现在o.b的值指向bValue变量，除非o.b被重新定义

//你不能尝试混合数据、访问器两种描述符
Object.defineProperty(o, 'conflict', {
    value: 'hello',
    get: () => {
        console.log(value);
        return value;
    }
});
//
// Cannot both specify accessors and a value or writable attribute 不能同时指定访问器和值或可写属性
//value只出现在数据描述符中，get只出现在访问器描述符中）
