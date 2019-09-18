let o = {};

o.a = 1;
//等同于：
Object.defineProperty(o, 'a', {
    value: 1,
    writable: true,
    configurable: true,
    enumerable: true
});


//另一方面，
Object.defineProperty(o, 'a', { value: 1 });
//等同于：
Object.defineProperty(o, 'a', {
    value: 1,
    writable: false,
    configurable: false,
    enumerable: false
});
