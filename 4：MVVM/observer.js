// let's do it 我们知道可以利用Obeject.defineProperty()来监听属性变动
// 那么将需要observe的数据对象进行递归遍历，包括子属性对象的属性，
// 都加上	setter和getter 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。。相关代码可以是这样：
let data = {name: 'hello'};
observe(data);
data.name = 'dmq'; // 哈哈哈，监听到值变化了 kindeng --> dmq

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach((key) => {
        defineReactive(data, key, data[key]);
    });
};

function defineReactive(data, key, val) {
    observe(val); // 监听子属性
    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: false, // 不能再define
        get: function() {
            return val;
        },
        set: function(newVal) {
            console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
            val = newVal;
        }
    });
}
