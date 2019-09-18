let a = {};
bValue = 1;
Object.defineProperty(a, "b", {
    set: (value) => {
        bValue = value;
        console.log("setted");
    },
    get: () => {
        return bValue;
    }
});
console.log(a.b); // 1
a.b = []; // setted
a.b = [1,2,3]; // setted
a.b[1] = 10; // 无输出
a.b.push(4); // 无输出
a.b.length = 5; // 无输出
console.log(a.b); // [1,10,3,4,undefined];
// 可以看到，当a.b被设置为数组后，只要不是重新赋值一个新的数组对象，
// 任何对数组内部的修改都不会触发setter方法的执行。这一点非常重要，
// 因为基于Object.defineProperty()方法的现代前端框架实现的数据双向绑定也同样无法识别这样的数组变化。
// 因此第一点，如果想要触发数据双向绑定，我们不要使用arr[1]=newValue;这样的语句来实现；
// 第二点，框架也提供了许多方法来实现数组的双向绑定。
// 对于框架如何实现数组变化的监测，大多数情况下，框架会重写Array.prototype.push方法，
// 并生成一个新的数组赋值给数据，这样数据双向绑定就会触发。作为框架使用者，
// 我们需要知道的就是，这样实现的数组修改会消耗更多的内存。
