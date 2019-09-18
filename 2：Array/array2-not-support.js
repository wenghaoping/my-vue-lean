let obArr = [];
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

Object.defineProperty(arrayMethods,'push',{
    value:function mutator(){
        console.log('obArr.push会走这里')
    }
});
Object.defineProperty(obArr,'push',{
    value: arrayMethods.push
});

obArr.push(0);
console.log(obArr);
