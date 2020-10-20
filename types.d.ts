
export declare interface AdaptorOptions {
    stage: any;
    EntityAdaptor: any;
    addDisplayFunc: (node: IEntity, parent: IEntity) => void;
    traverseFunc: (node: IEntity, callback: (node: any) => boolean | void) => void;
    bubblingFunc: (node: IEntity, callback: (node: any) => boolean | void) => void;
    loadAssetFunc: (config: any, onComplete: (res: any, opt: any) => void) => void;
    protocols?: {
        [key: string]: (app: Application, key: string, value: any, pid?: number) => any;
    };
    context?: any;
}

/**
 * 应用
 */
export declare class Application {
    private _launchOptions;
    private _adaptorOptions;
    private _componentDefs;
    private _entityDefs;
    private _manifest;
    private _docCaches;
    private _assetsManager;
    entityMap: {};
    /**
     * 启动配置
     */
    get launchOptions(): any;
    /**
     * 适配配置
     */
    get adaptorOptions(): AdaptorOptions;
    /**
     * 获取上下文
     */
    get context(): any;
    /**
     * 舞台实例
     */
    get stage(): any;
    constructor();
    /**
     * 启动
     * @param options
     * @param onProgress
     * @param onComplete
     */
    launch(options?: any, onProgress?: any, onComplete?: any): void;
    /**
     * 预加载场景
     * @param name
     * @param onProgress
     * @param onComplete
     */
    preloadScene(name: string, onProgress?: any, onComplete?: any): void;
    /**
     * 加载场景
     * @param name
     * @param onProgress
     * @param onComplete
     */
    private loadScene;
    _instantiateScene(doc: IDoc): any;
    /**
     * 启动场景
     * @param name
     * @param options
     * @param onProgress
     * @param onComplete
     */
    launchScene(name: string, options?: any, onProgress?: any, onComplete?: any): void;
    /**
     * 装配适配器
     * @param options
     * @return mainLoop 主循环方法
     */
    setupAdaptor(options: AdaptorOptions): (delta: number) => void;
    /**
     * 实例化场景或者预制体
     * @param doc
     */
    instantiate(doc: IDoc): any;
    /**
     * 注册组件类
     * @param id
     * @param def
     */
    registerComponentDef(id: any, def: any): void;
    /**
     * 批量注册组件类
     * @param defs {key: id, def}
     */
    registerComponentDefs(defs: any): void;
    /**
     * 注册实体类
     * @param type
     * @param def
     */
    registerEntityDef(type: any, def: any): void;
    /**
     * 批量注册实体类
     * @param defs
     */
    registerEntityDefs(defs: any): void;
    /**
     * 创建实体实例
     * @param type
     */
    createEntity(type: string): IEntity;
    /**
     * 获取全部已注册的实体定义
     */
    get entityDefs(): any;
    /**
     * 添加显示节点
     * @param node
     * @param parent
     */
    addDisplayNode(node: IEntity, parent: IEntity): void;
    /**
     * 遍历显示节点
     * @param node
     * @param callback
     */
    traverseDisplayNode(node: IEntity, callback: (node: any) => boolean | void): void;
    /**
     * 冒泡显示节点
     * @param node
     * @param callback
     */
    bubblingDisplayNode(node: IEntity, callback: (node: any) => boolean | void): void;
    /**
     * 加载单项资源
     * @param config
     * @param onComplete
     */
    loadAsset(config: any, onComplete?: any): void;
    /**
     * 加载资源
     * @param configs
     * @param onProgress
     * @param onComplete
     */
    loadAssets(configs: any, onProgress?: any, onComplete?: any): void;
    /**
     * 获取资源
     * @param uuid
     */
    getAsset(uuid: string): any;
    /**
     * 主循环方法，需要在适配器的实现中调用
     * @param delta
     * @private
     */
    private _mainLoop;
    /**
     * 遍历整个渲染树
     * @param delta
     * @param node
     * @private
     */
    private _onHit;
    /**
     * 实例化组件
     * @param id
     */
    $getComponentDef(id: any): any;
}

/**
 * 调用接口
 * @param uri
 * @param params
 * @param contentType
 * @param responseType
 * @param credentials
 */
export declare function callApi(uri: any, { host, params, method, credentials, contentType, }?: {
    host?: string;
    params?: any;
    method?: string;
    credentials?: string;
    contentType?: string;
}): Promise<any>;

/**
 * 一些重定义的类型
 */
/**
 * 颜色
 */
export declare type color = string | number;

/**
 * 组件类
 */
export declare class Component extends HashObject implements IComponent {
    private _entityAdaptor;
    private _enabled;
    private _started;
    get entityAdaptor(): IEntityAdaptor;
    get entity(): IEntity;
    constructor();
    /**
     * 是否有效
     */
    get enabled(): boolean;
    set enabled(value: boolean);
    /**
     * @private
     */
    $awake(entityAdaptor: IEntityAdaptor): void;
    /**
     * @private
     */
    $destroy(): void;
    /**
     * 当组件被唤醒时
     */
    awake(): void;
    /**
     * 当组件开始
     */
    start(): void;
    /**
     * 当生效时
     * 仅当实体唤醒状态
     */
    onEnable(): void;
    /**
     * 当失效时
     * 仅当实体唤醒状态
     */
    onDisable(): void;
    /**
     * 时钟更新
     * @param delta
     */
    update(delta: number): void;
    /**
     * 当被销毁时
     */
    onDestroy(): void;
    /**
     * @private
     * @param delta
     */
    $onUpdate(delta: number): void;
    /**
     * 当点击时
     * @param e
     */
    onClick(e: any): void;
    /**
     * 当鼠标按下
     * @param e
     */
    onMouseDown(e: any): void;
    /**
     * 当鼠标移动
     * @param e
     */
    onMouseMove(e: any): void;
    /**
     * 当鼠标松开
     * @param e
     */
    onMouseUp(e: any): void;
    /**
     * 当鼠标在实体外侧松开
     * @param e
     */
    onMouseUpOutside(e: any): void;
    /**
     * 向下广播执行
     * @param methodName
     * @param args
     */
    broadcast(methodName: string, ...args: any[]): void;
    /**
     * 向上冒泡执行
     * @param methodName
     * @param args
     */
    bubbling(methodName: string, ...args: any[]): void;
    addComponent(componentId: string | Function, enabled?: boolean): IComponent;
    getAllComponents(): IComponent[];
    getComponent(componentId: string | Function): IComponent;
    getComponents(componentId: string | Function): IComponent[];
    removeAllComponents(): any;
    removeComponent(componentId: string | Function, index?: number): IComponent[];
}

/**
 * 组件管理类
 */
export declare class ComponentManager {
    private _app;
    private _entityAdaptor;
    private _components;
    private _componentsNameMapping;
    private _componentsDefMapping;
    constructor(entityAdaptor: IEntityAdaptor, app: Application);
    applyProxy(): void;
    /**
     * 遍历组件
     * @param callback
     */
    eachComponent(callback: (component: Component, index: number) => unknown): void;
    /**
     * 设置激活状态
     * @param active
     */
    setActive(active: boolean): void;
    /**
     * 时钟更新
     * @param t
     */
    onUpdate(t: number): void;
    /**
     * 交互事件
     */
    onInteract(type: string, e: any): void;
    /**
     * 添加组件
     * @param componentId
     * @param awake
     * @param enabled
     */
    addComponent(componentId: any, awake?: boolean, enabled?: boolean): Component;
    /**
     * 移除组件
     * @param componentId
     * @param index
     */
    removeComponent(componentId: any, index?: number): any;
    /**
     * 移除所有组件
     */
    removeAllComponents(): void;
    /**
     * 获取组件
     * @param componentId
     */
    getComponent(componentId: any): Component;
    /**
     * 获取组件组
     * @param componentId
     */
    getComponents(componentId: any): Component[];
    /**
     * 获取全部组件
     */
    getAllComponents(): Component[];
    /**
     * 添加组件
     * @param component
     * @param index
     * @param awake
     */
    private _add;
    /**
     * 移除组件
     * @param components
     */
    private _remove;
    /**
     * 移除所有组件
     */
    private _removeAll;
    /**
     * 根据组件名称获取指定类的组件列表
     * @param componentId
     */
    private _findByName;
    /**
     * 获取指定类的组件列表
     * @param clazz
     */
    private _find;
    /**
     * 获取指定类的组件
     * @param name
     */
    private _getByName;
    /**
     * 获取指定类的组件
     * @param clazz
     */
    private _getOne;
    /**
     * 获取所有组件
     */
    private get all();
    /**
     * 调用组件上的方法
     * @param methodName
     * @param args
     */
    invokeOnComponents(methodName: any, args: any): void;
    /**
     * 当添加组件时
     * @param component
     * @param awake
     */
    $onAddComponent(component: Component, awake?: boolean): void;
    /**
     * 当移除组件时
     * @param component
     */
    $onRemoveComponent(component: Component): void;
    $instantiateComponent(componentId: any): Component;
}

/**
 * 属性拷贝
 * @param target
 * @param data
 * @param schema
 */
export declare function copyProp(target: any, data?: any, schema?: any): void;

/**
 * json5字符串转对象
 * @param str
 */
export declare function decodeJson5(str: any): any;

/**
 * 深度属性变脏时设置宿主的dirty属性为true
 */
export declare const deepDirtyFieldDetector: (target: any, key: string) => void;

/**
 * 深入属性变脏时触发onModify方法
 */
export declare const deepDirtyFieldTrigger: (target: any, key: string) => void;

/**
 * 属性变脏时设置宿主的dirty属性为true
 */
export declare const dirtyFieldDetector: (target: any, key: string) => void;

/**
 * 属性变脏时触发onModify方法
 */
export declare const dirtyFieldTrigger: (target: any, key: string) => void;

/**
 * 动态数据
 */
export declare type dynamic = any;

/**
 * 实体适配器基类
 */
export declare abstract class EntityAdaptorBase implements IEntityAdaptor {
    protected readonly _components: ComponentManager;
    protected readonly _entity: any;
    private _app;
    /**
     * @inheritDoc
     */
    get components(): ComponentManager;
    /**
     * @inheritDoc
     */
    get entity(): any;
    /**
     * @inheritDoc
     */
    get app(): Application;
    /**
     * @inheritDoc
     */
    getActive(): boolean;
    /**
     * @inheritDoc
     */
    setActive(v: boolean): void;
    constructor(entity: any, app: Application);
    /**
     * 应用代理
     */
    applyProxy(): void;
    /**
     * 触发生命周期方法
     * @param type
     * @param args
     */
    invokeLifecycle(type: string, ...args: any[]): void;
    /**
     * 触发交互事件方法
     * @param type
     * @param e
     */
    invokeInteractionEvent(type: string, e: any): void;
}

/**
 * Created by rockyl on 2018/11/9.
 *
 * 属性装饰器
 */
/**
 * 属性修改时触发
 * @param onModify
 */
export declare function fieldChanged(onModify: any): (target: any, key: string) => void;

/**
 * Created by rockyl on 2018/11/5.
 */
/**
 * 哈希对象
 */
export declare class HashObject {
    private _hashCode;
    constructor();
    get hashCode(): number;
}

/**
 * Created by rockyl on 2020-04-01.
 */
/**
 * 隐藏的属性
 */
export declare function hidden(): void;

export declare interface IComponent {
    readonly entityAdaptor: IEntityAdaptor;
    readonly entity: any;
    enabled: boolean;
    broadcast(methodName: string, ...args: any[]): any;
    bubbling(methodName: string, ...args: any[]): any;
    awake(): any;
    start(): any;
    onEnable(): any;
    onDisable(): any;
    update(delta: number): any;
    onDestroy(): any;
    onClick(e: any): any;
    onMouseDown(e: any): any;
    onMouseMove(e: any): any;
    onMouseUp(e: any): any;
    onMouseUpOutside(e: any): any;
    /**
     * 添加组件
     * @param componentId
     * @param enabled
     */
    addComponent(componentId: string | Function, enabled?: boolean): IComponent;
    /**
     * 移除组件
     * @param componentId
     * @param index
     */
    removeComponent(componentId: string | Function, index?: number): IComponent[];
    /**
     * 移除所有组件
     */
    removeAllComponents(): any;
    /**
     * 获取组件
     * @param componentId
     */
    getComponent(componentId: string | Function): IComponent;
    /**
     * 获取组件组
     * @param componentId
     */
    getComponents(componentId: string | Function): IComponent[];
    /**
     * 获取全部组件
     */
    getAllComponents(): IComponent[];
}

declare interface IDoc {
    name: string;
    type: 'scene' | 'prefab';
    factory: Function;
    assets: any[];
}

/**
 * 实体接口
 */
export declare interface IEntity {
    /**
     * 激活状态
     */
    readonly active: boolean;
    /**
     * 舞台
     */
    readonly stage: any;
    entityAdaptor: IEntityAdaptor;
    /**
     * 实例化视图配置
     * @param docConfig
     */
    instantiate(docConfig: any): any;
    /**
     * 设置激活状态
     * @param active
     */
    setActive(active: boolean): any;
    /**
     * 添加组件
     * @param componentId
     * @param enabled
     */
    addComponent(componentId: string | Function, enabled?: boolean): IComponent;
    /**
     * 移除组件
     * @param componentId
     * @param index
     */
    removeComponent(componentId: string | Function, index?: number): IComponent[];
    /**
     * 移除所有组件
     */
    removeAllComponents(): any;
    /**
     * 获取组件
     * @param componentId
     */
    getComponent(componentId: string | Function): IComponent;
    /**
     * 获取组件组
     * @param componentId
     */
    getComponents(componentId: string | Function): IComponent[];
    /**
     * 获取全部组件
     */
    getAllComponents(): IComponent[];
    /**
     * 调用组件上的方法
     * @param methodName
     * @param args
     */
    invokeOnComponents(methodName: any, ...args: any[]): any;
}

/**
 * 实体适配器接口
 */
export declare interface IEntityAdaptor {
    /**
     * 组件管理实例
     */
    readonly entity: IEntity;
    /**
     * 实体
     */
    readonly components: ComponentManager;
    /**
     * 获取应用
     */
    readonly app: Application;
    /**
     * 获取激活状态
     */
    getActive(): boolean;
    /**
     * 设置激活状态
     * @param active
     */
    setActive(active: boolean): any;
    invokeLifecycle(type: string, ...args: any[]): any;
    invokeInteractionEvent(type: string, ...args: any[]): any;
}

/**
 * 属性注入方法
 * @param target 目标对象
 * @param data 被注入对象
 * @param callback 自定义注入方法
 * @param ignoreMethod 是否忽略方法
 * @param ignoreNull 是否忽略Null字段
 *
 * @return 是否有字段注入
 */
export declare function injectProp(target: any, data?: any, callback?: Function, ignoreMethod?: boolean, ignoreNull?: boolean): boolean;

/**
 * Created by rockyl on 2020-03-09.
 */
/**
 * 线性插值
 * @param begin number
 * @param end number
 * @param t number
 * @param allowOutOfBounds
 * @return number
 */
export declare function lerp(begin: number, end: number, t: number, allowOutOfBounds?: boolean): number;

/**
 * 线性插值
 * @param begin
 * @param end
 * @param t number
 * @param allowOutOfBounds
 * @return number
 */
export declare function lerpVector2(begin: {
    x: number;
    y: number;
}, end: {
    x: number;
    y: number;
}, t: number, allowOutOfBounds?: boolean): {
    x: number;
    y: number;
};

/**
 * 线性插值
 * @param begin
 * @param end
 * @param t number
 * @param allowOutOfBounds
 * @return number
 */
export declare function lerpVector3(begin: {
    x: number;
    y: number;
    z: number;
}, end: {
    x: number;
    y: number;
    z: number;
}, t: number, allowOutOfBounds?: boolean): {
    x: number;
    y: number;
    z: number;
};

/**
 * 对象转搜索字符串
 * @param obj
 */
export declare function objectStringify(obj: any): string;

/**
 * 单一事件类
 * 一对多形式的订阅分发机制
 */
export declare class QunityEvent extends HashObject {
    private _subscribers;
    constructor();
    private findListener;
    /**
     * 添加侦听
     * @param callback
     * @param thisObj
     * @param priority
     * @param params
     */
    addListener(callback: any, thisObj?: any, priority?: number, ...params: any[]): void;
    /**
     * 添加侦听配置
     * @param config
     */
    addListenerConfig(config: any): void;
    /**
     * 添加单次侦听
     * @param callback
     * @param thisObj
     * @param priority
     * @param params
     */
    once(callback: any, thisObj?: any, priority?: number, ...params: any[]): void;
    /**
     * 移除侦听
     * @param callback
     */
    removeListener(callback: any): void;
    /**
     * 是否已经侦听
     * @param callback
     */
    hasListener(callback: any): boolean;
    /**
     * 调用派发
     * @param paramsNew
     */
    invoke(...paramsNew: any[]): void;
}

/**
 * 原数据
 */
export declare type raw = any;

/**
 * 资源
 */
export declare type resource = any;

/**
 * 2D矢量
 */
export declare class Vector2 extends HashObject implements vector2 {
    /**
     * x分量
     */
    x: number;
    /**
     * y分量
     */
    y: number;
    onChange: Function;
    /**
     * 创建一个2D矢量
     * @param x x分量
     * @param y y分量
     * @param onChange 当改变时触发
     */
    constructor(x?: number, y?: number, onChange?: Function);
    $onModify(value: any, key: any, oldValue: any): void;
    /**
     * 设置分量
     * @param x
     * @param y
     */
    setXY(x?: number, y?: number): Vector2;
    /**
     * 从一个向量拷贝分量
     * @param v2
     */
    copyFrom(v2: any): Vector2;
    /**
     * 克隆出一个向量
     */
    clone(): Vector2;
    /**
     * 把向量置空
     */
    zero(): Vector2;
    /**
     * 是不是一个0向量
     */
    get isZero(): boolean;
    /**
     * 单位化向量
     */
    normalize(): Vector2;
    /**
     * 是不是一个单位向量
     */
    get isNormalized(): boolean;
    /**
     * 截取向量长度
     * @param max
     */
    truncate(max: any): Vector2;
    /**
     * 向量反向
     */
    reverse(): Vector2;
    /**
     * 获取点乘
     * @param v2
     */
    dotProd(v2: any): number;
    /**
     * 获取叉乘
     * @param v2
     */
    crossProd(v2: any): number;
    /**
     * 获取长度的平方
     * @param v2
     */
    distSQ(v2: any): number;
    /**
     * 获取两个向量的距离
     * @param v2
     */
    distance(v2: any): number;
    /**
     * 向量加法
     * @param v2
     */
    add(v2: any): Vector2;
    /**
     * 向量减法
     * @param v2
     */
    subtract(v2: any): Vector2;
    /**
     * 向量乘于某个数
     * @param value
     */
    multiply(value: number): Vector2;
    /**
     * 向量除于某个数
     * @param value
     */
    divide(value: number): Vector2;
    /**
     * 向量角度
     * @param value
     */
    set angle(value: number);
    get angle(): number;
    /**
     * 向量弧度
     * @param value
     */
    set radian(value: number);
    get radian(): number;
    /**
     * 是否等于某个向量
     * @param v2
     */
    equals(v2: any): boolean;
    /**
     * 向量长度
     * @param value
     */
    get length(): number;
    set length(value: number);
    /**
     * 获取向量长度的平方
     */
    get lengthSQ(): number;
    /**
     * 获取向量斜率
     */
    get slope(): number;
    toString(): string;
    toObj(): {
        x: number;
        y: number;
    };
    toArray(): number[];
    static corner(v1: any, v2: any): number;
}

/**
 * 2d矢量
 */
export declare interface vector2 {
    x?: number;
    y?: number;
}

export { }
