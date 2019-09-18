let pattern = {
    get: function () {
        return 'I always return this string, whatever you have assigned';
    },
    set: function () {
        this.myname = 'this is my name string';
    }
};


function TestDefineSetAndGet() {
    Object.defineProperty(this, 'myproperty', pattern);
}


let instance = new TestDefineSetAndGet();
instance.myproperty = 'test';
console.log(instance.myproperty);
// I always return this string, whatever you have assigned

console.log(instance.myname); // this is my name string
// Object.defineProperty()方法被许多现代前端框架（如Vue.js，React.js）用于数据双向绑定的实现，
// 当我们在框架Model层设置data时，框架将会通过Object.defineProperty()方法来绑定所有数据，
// 并在数据变化的同时修改虚拟节点，最终修改页面的Dom结构。
// 在这个过程中有几点需要注意：
// 延迟发生变化
// 现代框架为了避免密集的Dom修改操作，对绑定的数据修改后将会设置一个极小
// （通常为1ms）的setTimeout延迟再应用变化。也就是说，虚拟节点和页面Dom树的变化和数据的变化中间会存在一个空闲期。
// 注意到这一点的开发者就会意识到，如果我们想实现一个功能：在某项数据变化后，页面立即产生变化，
// 并且下一步开发者将获取这个变化的Dom…这样的功能通过现代前端框架是无法完成的。
// 当然，那些框架也为我们提供了许多应对方法，例如Vue的nextTick()方法等。
//
// 数组的变化
