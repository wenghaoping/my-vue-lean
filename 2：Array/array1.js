// 定义一个需要监听变化的数组
let obArr = [];

// 来copy一份数组的原型方法,防止污染原生数组方法
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

// 我们先把arrayMethods对象上的push转换为观察者对象
Object.defineProperty(arrayMethods,'push',{
    value: function mutator(){
        console.log('obArr.push会走这里')
    }
});
// 此时arrayMethods定义了一个push的新属性，
// 那么我们如何把它和 let obArr = [] 绑定起来
obArr.__proto__ = arrayMethods;

obArr.push(0);
console.log(obArr);
