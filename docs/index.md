# Qunity
![Logo](https://rockyf.github.io/qunity-core/assets/Logo.png)  
Qunity是`E/C`(实体/组件)架构的实现，如果你会Unity开发，那应该对此很熟悉，Unity就是实现了E/C架构的最典型的例子。  
## Qunity
与传统E/C架构的不同之处在于：Qunity是一个E/C架构的实现，但是只是一个核心功能，需要依附于其他渲染引擎才能算是一个完整的实现。比如，可以依附于Pixi.js或者Egret，站在巨人的肩膀上，而不是重复造轮子去实现一遍渲染引擎。
正是如此，Qunity的实现依赖于树形的渲染结构，节点上能挂载n个组件，组件则包含了一定的逻辑和状态，并通过生命周期和交互事件来驱动。  
这样，便形成了一棵有逻辑处理能力的实体树：  
![EntityTree](https://rockyf.github.io/qunity-core/assets/EntityTree.png)
## Qunity的优势
Qunity所实现的E/C架构，能让逻辑解耦成各种单独模块，模块与模块可以自由组合，产生各种逻辑组合效果。  
例如：组件A让实体向前运动，组件B让实体跳动，这两个组件组合可以产生四种效果：
1. 不加载任何组件，则实体静止
2. 只挂载组件A，则实体匀速移动
3. 只挂载组件B，则实体跳动
4. 挂载组件A和组件B，则实体会向前跳动

## Qunity能干什么？
Qunity只是一次前端架构的实现，所以适用于所有的前端应用场景(APP，游戏前端)，但是Qunity的设计初衷是为了游戏前端的开发。  
现已适配了Pixi.js，可以使用Pixi.js的高性能和Qunity的组件化开发！

## 组件生命周期
![ComponentLifecycle](https://rockyf.github.io/qunity-core/assets/component-lifecycle.png)