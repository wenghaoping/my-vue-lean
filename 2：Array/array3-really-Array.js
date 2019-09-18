let obArr = [];
// 来copy一份数组的原型方法,防止污染原生数组方法
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
Object.defineProperty(arrayMethods,'push',{
    value: function mutator(){
        /* 将数组的原生方法缓存起来，后面要调用 */
        const original = arrayProto['push'];
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
    }
});
// 现在每次执行obArr.push(0)时,obArr都会新增一项。
obArr.__proto__ = arrayMethods;

obArr.push(0);
obArr.push(1);
obArr.push(2);
console.log('=======');
console.log(obArr);

