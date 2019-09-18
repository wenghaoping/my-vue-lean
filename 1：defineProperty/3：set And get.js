let a= {};
Object.defineProperty(a, "b", {
    set: (newValue) => {
        console.log("你要赋值给我,我的新值是" + newValue);
        return newValue
    },
    get: () => {
        console.log("你取我的值");
        return 2 //注意这里，我硬编码返回2
    }
});
a.b = 1; //打印 你要赋值给我,我的新值是1
console.log(a.b);    //打印 你取我的值
                    //打印 2    注意这里，和我的硬编码相同的
// 这个 “b” 赋值 或者 取值的时候会分别触发 set 和 get 对应的函数
// 没有赋值的时候，只触发get函数
