class Compile {
    // 传入$el, mvvm this
    constructor (el, vm) {
        // 判断是否是元素节点
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            // 如果这个元素能获取到，首先先取到节点，如果一个个取值，则性能很差
            // 1.先把这些真实的DOM移入到内存中fragment
            //$fragment 是一个对空文档对象 DocumentFragment 对象的引用。
            this.$fragment = this.node2Fragment(this.$el);
            // 2.编译 => 提取想要的元素节点v-model 和文本节点 {{}}
            this.compile(this.$fragment);

            // 3.把编译好的fragment在放回页面里去
            this.$el.appendChild(this.$fragment);

        }
    }
    // 写辅助方法

    // 是不是元素节点
    isElementNode (node) {
        // document.body.nodeType === 1;
        // 返回1，代表是一个元素
        return node.nodeType === 1;
    }
    // 是不是指令
    isDirective (attr) {
        return attr.includes('v-');
    }
    // 是不是事件
    isEventDirective(directive) {
        return directive.includes('on');
    }
    // 是不是for循环
    isForDirective(directive) {
        return directive.includes('for');
    }


    // 核心方法

    // 编译元素节点
    compileElement (node) {
        // 带v-
        let attr = node.attributes;// 取出当前节点的属性(一个无顺序的节点列表。)
        Array.from(attr).forEach(attribute => {
            // 判断属性名字是否包含v-model v-text
            const attributeName = attribute.name;
            // 取出属性对应的值 message user.firstname ....
            const property = attribute.value;
            // 判断是不是指令
            if (this.isDirective(attributeName)) {
                // 取对应的值放到节点中
                // node vm.$data property
                // 取到对应的方法，model text .....
                const directive = attributeName.slice(2);
                // 是否是事件
                if (this.isEventDirective(directive)) {
                    // 为这个node节点添加事件监听器
                    CompileUtil.addEventHandler(node, this.$vm, property, directive);
                } else {
                    // 普通指令
                    // console.log(directive);
                    CompileUtil[directive] &&
                    CompileUtil[directive](node, this.$vm, property);
                }
            }
        })
    }

    // 编译文本节点
    compileText (node) {
        // 带 {{ }}
        const property = node.textContent;

        const reg = /{\{([^}]+)\}\}/g;
        if (reg.test(property)) {
            // node vm.$data text
            CompileUtil['text'](node, this.$vm, property);
        }
    }

    // 开始解析模板
    compile(fragment) {
        // 返回指定元素的子节点集合，包括元素节点和文本节点。返回文档集合,子节点集合
        const childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node => {
            // 判断是否是元素节点，和文本节点
            if (this.isElementNode(node)) {
                // 是元素节点 是否存在v-
                // 这里编译元素
                this.compileElement(node);
                // 如果是元素节点，继续深入检查, 需要递归
                this.compile(node);
            } else {
                // 文本节点
                // 这里编译文本
                this.compileText(node);
            }
        })
    }
    // 需要将el中的内容全部放到内存中
    node2Fragment (el) {
        // 创建文档片段对象，不是真实的dom 11，内存中的dom节点
        // 操作Fragmen，不会造成页面重绘
        let fragment = document.createDocumentFragment();
        // 将原来的每一个节点都移入到文档片段中
        // 第一个节点
        let firstChile = null;
        // 获取指定元素的第一个子节点，可以是元素节点，也可以是文本节点。
        // firstChild 属性返回指定节点的首个子节点，以 Node 对象。
        while (firstChile = el.firstChild) {
            fragment.appendChild(firstChile);
        }
        // 返回内存中的节点
        return fragment;
    }
}

CompileUtil = {
    // 获取其中的值
    _getVal (vm, property) {
        let value = property.split('.'); // [a, b, c]
        return value.reduce((prev, next) => {
            return prev[next];
        }, vm.$data);
    },
    // 获取编译以后的文本的结果
    _getTextVal (vm, property) {
        return property.replace(/{\{([^}]+)\}\}/g, (...arguments) => {
            return this._getVal(vm, arguments[1]);
        });
    },
    // 设置值
    _setVal (vm, property, newValue) { // [message, a]
        let value = property.split('.');
        return value.reduce((prev, next, currentIndex) => {
            if (currentIndex === value.length - 1) {
                return prev[next] = newValue;
            }
            return prev[next];
        }, vm.$data);
    },
    // 文本处理
    text (node, vm, property) {
        let updaterFn = this.updater['textUpdater'];
        // property === {{user.firstname}} => user.firstname
        property.replace(/{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], (newValue) => {
                // 当值变化后，会调用callback，将新的值传过来
                // 变化后，文本节点需要重新获取依赖的属性更新文本中的内容
                updaterFn && updaterFn(node, this._getTextVal(vm, newValue));
            });
        });
        updaterFn && updaterFn(node, this._getTextVal(vm, property));
    },
    // v-html处理
    html(node, vm, property) {
        let updaterFn = this.updater['htmlUpdater'];
        new Watcher(vm, property, (newValue) => {
            updaterFn && updaterFn(node, this._getVal(vm, property));
        });
        updaterFn && updaterFn(node, this._getVal(vm, property));
    },
    // 输入框处理
    model (node, vm, property) {
        let updaterFn = this.updater['modelUpdater'];
        // 这里需要添加监控，数据变化了，应该调用这个watch的callback
        new Watcher(vm, property, (newValue) => {
            // 当值变化后，会调用callback，将新的值传过来
            // 默认不会调用，需要调用update才可以
            updaterFn && updaterFn(node, this._getVal(vm, property));
        });
        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
            this._setVal(vm, property, newValue);
        });
        updaterFn && updaterFn(node, this._getVal(vm, property));
    },
    // on:click
    // 监听事件
    addEventHandler(node, vm, property, directive) {
        const eventType = directive.split(':')[1];
        // 如果第一个值是对象, 则返回第二个操作数
        const fn = vm.$option.methods && vm.$option.methods[property];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
    updater: {
        // 文本更新
        textUpdater (node, value) {
            node.textContent = typeof value === 'undefined' ? '' : value;
        },
        // 输入框更新
        modelUpdater (node, value) {
            node.value = typeof value === 'undefined' ? '' : value;
        },
        // 将当前元素节点的innerHTML替换成属性值。
        htmlUpdater(node, value) {
            node.innerHTML = value || '';
        },
        // 将当前元素节点的className替换成属性值。
        classUpdater(node, newClass) {
            const { className } = node;
            const value = String(newClass) ? newClass : '';
            node.className = className ? ' ' : `${value}`;
        }
    }
}
