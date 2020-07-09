/**
 * Created by rockyl on 2020-03-11.
 */
var _a;
//todo script,dynamic
var Protocols;
(function (Protocols) {
    Protocols["ASSET"] = "asset://";
    Protocols["ENTITY"] = "entity://";
})(Protocols || (Protocols = {}));
var protocols = (_a = {},
    _a[Protocols.ASSET] = asset,
    _a[Protocols.ENTITY] = entity,
    _a);
function asset(app, key, value) {
    var trulyValue;
    var uuid = value.replace(Protocols.ASSET, '');
    trulyValue = app.getAsset(uuid);
    return trulyValue;
}
function entity(app, key, value, pid) {
    var trulyValue;
    if (value) {
        var uuid = transPrefabUUID(value.replace(Protocols.ENTITY, ''), pid);
        trulyValue = app.entityMap[uuid];
    }
    else {
        trulyValue = null;
    }
    return trulyValue;
}
function transPrefabUUID(uuid, pid) {
    return pid ? pid + '_' + uuid : uuid;
}
//# sourceMappingURL=protocols.js.map

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/**
 * Created by rockyl on 2018/11/5.
 */
var HASH_CODE_INK = 0;
function getHashCode() {
    return ++HASH_CODE_INK;
}
/**
 * 哈希对象
 */
var HashObject = /** @class */ (function () {
    function HashObject() {
        this._hashCode = getHashCode();
    }
    Object.defineProperty(HashObject.prototype, "hashCode", {
        get: function () {
            return this._hashCode;
        },
        enumerable: true,
        configurable: true
    });
    return HashObject;
}());
//# sourceMappingURL=HashObject.js.map

/**
 * Created by rockyl on 2020-04-07.
 */
/**
 * 单一事件类
 * 一对多形式的订阅分发机制
 */
var QunityEvent = /** @class */ (function (_super) {
    __extends(QunityEvent, _super);
    function QunityEvent() {
        var _this = _super.call(this) || this;
        _this._subscribers = [];
        return _this;
    }
    QunityEvent.prototype.findListener = function (callback) {
        var _subscribers = this._subscribers;
        var result;
        for (var i = 0, li = _subscribers.length; i < li; i++) {
            var subscriber = _subscribers[i];
            if (subscriber.callback == callback) {
                result = {
                    subscriber: subscriber,
                    index: i,
                };
                break;
            }
        }
        return result;
    };
    /**
     * 添加侦听
     * @param callback
     * @param thisObj
     * @param priority
     * @param params
     */
    QunityEvent.prototype.addListener = function (callback, thisObj, priority) {
        if (priority === void 0) { priority = 0; }
        var params = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            params[_i - 3] = arguments[_i];
        }
        if (!callback) {
            return;
        }
        var _subscribers = this._subscribers;
        var listener = this.findListener(callback);
        if (!listener) {
            _subscribers.push({
                callback: callback,
                thisObj: thisObj,
                priority: priority,
                params: params,
            });
        }
    };
    /**
     * 添加侦听配置
     * @param config
     */
    QunityEvent.prototype.addListenerConfig = function (config) {
        var entity = config.entity, componentIndex = config.component, methodName = config.method;
        if (entity && componentIndex >= 0 && methodName) {
            this._subscribers.push(config);
        }
    };
    /**
     * 添加单次侦听
     * @param callback
     * @param thisObj
     * @param priority
     * @param params
     */
    QunityEvent.prototype.once = function (callback, thisObj, priority) {
        if (priority === void 0) { priority = 0; }
        var params = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            params[_i - 3] = arguments[_i];
        }
        if (!callback) {
            return;
        }
        var _subscribers = this._subscribers;
        var listener = this.findListener(callback);
        if (!listener) {
            _subscribers.push({
                callback: callback,
                thisObj: thisObj,
                priority: priority,
                params: params,
                once: true,
            });
        }
    };
    /**
     * 移除侦听
     * @param callback
     */
    QunityEvent.prototype.removeListener = function (callback) {
        if (!callback) {
            return;
        }
        var _subscribers = this._subscribers;
        if (typeof callback === 'object') {
            _subscribers.splice(_subscribers.indexOf(callback), 1);
        }
        else {
            var listener = this.findListener(callback);
            if (listener) {
                _subscribers.splice(listener.index, 1);
            }
        }
    };
    /**
     * 是否已经侦听
     * @param callback
     */
    QunityEvent.prototype.hasListener = function (callback) {
        return !!this.findListener(callback);
    };
    /**
     * 调用派发
     * @param paramsNew
     */
    QunityEvent.prototype.invoke = function () {
        var paramsNew = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paramsNew[_i] = arguments[_i];
        }
        var _subscribers = this._subscribers;
        //按优先级降序
        _subscribers.sort(function (a, b) {
            return a.priority - b.priority;
        });
        for (var _a = 0, _subscribers_1 = _subscribers; _a < _subscribers_1.length; _a++) {
            var subscriber = _subscribers_1[_a];
            if (subscriber) {
                var callback = void 0, thisObj = void 0;
                var params = subscriber.params, once = subscriber.once;
                var allParams = params.concat(paramsNew);
                if (subscriber.entity) {
                    var entity = subscriber.entity, componentIndex = subscriber.component, methodName = subscriber.method;
                    var component = entity.getAllComponents()[componentIndex];
                    if (component) {
                        callback = component[methodName];
                    }
                    thisObj = entity;
                }
                else {
                    callback = subscriber.callback;
                    thisObj = subscriber.thisObj;
                }
                if (callback) {
                    try {
                        callback.apply(thisObj, allParams);
                    }
                    catch (e) {
                        //console.log(e);
                    }
                    if (once) {
                        if (subscriber.entity) {
                            this.removeListener(subscriber);
                        }
                        else {
                            this.removeListener(callback);
                        }
                    }
                }
            }
        }
    };
    return QunityEvent;
}(HashObject));
//# sourceMappingURL=QunityEvent.js.map

/**
 * Created by rockyl on 2020-03-10.
 */
var prefabID = 0;
var specialProps = ['enabled', 'active', 'script',];
/**
 * 实例化节点树
 * @param app
 * @param doc
 */
function instantiate(app, doc) {
    if (doc) {
        var view = doc.factory();
        var pid = void 0;
        if (doc.type === 'prefab') {
            pid = ++prefabID;
        }
        setupComponent(app, view, pid);
        enableComponent(app, view);
        return view;
    }
}
/**
 * 装配组件
 * @param app
 * @param entity
 * @param pid
 */
function setupComponent(app, entity, pid) {
    if (!entity.children) {
        return;
    }
    for (var i = 0, li = entity.children.length; i < li; i++) {
        var child = entity.children[i];
        var comps = child['$componentConfigs'];
        if (comps) {
            var compManager = child.entityAdaptor.components;
            for (var _i = 0, comps_1 = comps; _i < comps_1.length; _i++) {
                var comp = comps_1[_i];
                var component = compManager.addComponent(comp.script, false);
                component.enabled = comp.enabled !== false;
                injectProps(app, component, comp, pid);
                compManager.$onAddComponent(component, true);
            }
        }
        setupComponent(app, child, pid);
    }
}
/**
 * 使能组件
 * @param app
 * @param entity
 * @param pid
 */
function enableComponent(app, entity, pid) {
    for (var i = 0, li = entity.children.length; i < li; i++) {
        var child = entity.children[i];
        var compManager = child.entityAdaptor.components;
        compManager.setActive(true);
        enableComponent(app, child);
    }
}
/**
 * 注入属性
 * @param app
 * @param target
 * @param props
 * @param pid
 */
function injectProps(app, target, props, pid) {
    if (props && target) {
        for (var field in props) {
            if (specialProps.indexOf(field) >= 0) {
                continue;
            }
            var value = props[field];
            if (typeof value === 'object') { //复杂数据
                transComplexProps(app, target, field, value);
            }
            else {
                transBaseProps(app, target, field, value, pid);
            }
        }
    }
}
function injectEvent(app, listeners, pid) {
    var event = new QunityEvent();
    for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
        var listener = listeners_1[_i];
        listener.entity = protocols[Protocols.ENTITY](app, '', listener.entity, pid);
        event.addListenerConfig(listener);
    }
    return event;
}
function transComplexProps(app, target, field, value, pid) {
    var trulyValue = value;
    var override = false;
    switch (value.type) {
        case 'event':
            trulyValue = injectEvent(app, value.payload, pid);
            break;
        case 'raw':
            override = true;
            trulyValue = value.payload;
            break;
        default:
            if (Array.isArray(value) && !target[field]) {
                target[field] = [];
            }
            injectProps(app, target[field], value, pid);
            break;
    }
    if (override) {
        target[field] = trulyValue;
    }
}
/**
 * 转换基础类型的属性
 * @param app
 * @param target
 * @param field
 * @param value
 * @param pid
 */
function transBaseProps(app, target, field, value, pid) {
    var trulyValue = value;
    if (typeof value === 'string') {
        var hit = void 0;
        var protocolGroups = [protocols, app.adaptorOptions.protocols];
        for (var _i = 0, protocolGroups_1 = protocolGroups; _i < protocolGroups_1.length; _i++) {
            var protocols_1 = protocolGroups_1[_i];
            for (var protocol in protocols_1) {
                if (value.indexOf(protocol) === 0) {
                    var protocolFunc = protocols_1[protocol];
                    trulyValue = protocolFunc(app, field, value, pid);
                    hit = true;
                    break;
                }
            }
            if (hit) {
                break;
            }
        }
    }
    target[field] = trulyValue;
}
//parse scene//
function parseViewDoc(app, docSource) {
    function p(props) {
        injectProps(app, this, props);
        if (props.active !== false && this.setActive) {
            this.setActive(true);
        }
        return this;
    }
    function kv(props) {
        for (var key in props) {
            this[key] = props[key];
        }
        return this;
    }
    function c(children) {
        for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
            var child = children_2[_i];
            app.addDisplayNode(child, this);
        }
        return this;
    }
    function s(components) {
        Object.defineProperty(this, '$componentConfigs', {
            value: components,
            writable: false,
            enumerable: false,
        });
        return this;
    }
    var pixiNodes = {};
    var requireContext = {
        'qunity': {
            Doc: function (props) {
                var obj = {
                    kv: kv,
                    p: p,
                };
                setTimeout(function () {
                    delete obj['kv'];
                    delete obj['p'];
                });
                return obj.p(props);
            }
        },
        'qunity-pixi': pixiNodes,
    };
    function requireMethod(id) {
        return requireContext[id];
    }
    var entityNames = Object.keys(app.entityDefs);
    var _loop_1 = function (entityName) {
        pixiNodes[entityName] = function (props) {
            var entity = app.createEntity(entityName);
            if (props.uuid !== undefined) {
                app.entityMap[props.uuid] = entity;
            }
            entity['kv'] = kv;
            entity['p'] = p;
            entity['c'] = c;
            entity['s'] = s;
            setTimeout(function () {
                delete entity['kv'];
                delete entity['p'];
                delete entity['c'];
                delete entity['s'];
            });
            return p.call(entity, props);
        };
    };
    for (var _i = 0, entityNames_1 = entityNames; _i < entityNames_1.length; _i++) {
        var entityName = entityNames_1[_i];
        _loop_1(entityName);
    }
    var func = new Function('require', 'exports', docSource);
    var exports = {};
    func(requireMethod, exports);
    return exports.doc;
}
//# sourceMappingURL=interpreter.js.map

var AssetsManager = /** @class */ (function () {
    function AssetsManager(app) {
        this._assetCache = {};
        this._app = app;
    }
    AssetsManager.prototype.addAsset = function (asset, opt) {
        this._assetCache[opt.uuid || opt.name || opt.url] = asset;
    };
    AssetsManager.prototype.getAsset = function (uuid) {
        return this._assetCache[uuid];
    };
    AssetsManager.prototype.clean = function () {
        this._assetCache = {};
    };
    return AssetsManager;
}());
//# sourceMappingURL=assets-manager.js.map

/**
 * Created by rockyl on 2020-03-08.
 */
/**
 * 应用
 */
var Application = /** @class */ (function () {
    function Application() {
        var _this = this;
        this._componentDefs = {};
        this._entityDefs = {};
        this._docCaches = {};
        this.entityMap = {};
        /**
         * 主循环方法，需要在适配器的实现中调用
         * @param delta
         * @private
         */
        this._mainLoop = function (delta) {
            _this._adaptorOptions.traverseFunc(_this._adaptorOptions.stage, _this._onHit.bind(_this, delta));
        };
        this._assetsManager = new AssetsManager(this);
    }
    Object.defineProperty(Application.prototype, "launchOptions", {
        /**
         * 启动配置
         */
        get: function () {
            return this._launchOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "adaptorOptions", {
        /**
         * 适配配置
         */
        get: function () {
            return this._adaptorOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "context", {
        /**
         * 获取上下文
         */
        get: function () {
            return this._adaptorOptions.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "stage", {
        /**
         * 舞台实例
         */
        get: function () {
            return this._adaptorOptions.stage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 启动
     * @param options
     * @param onProgress
     * @param onComplete
     */
    Application.prototype.launch = function (options, onProgress, onComplete) {
        var _this = this;
        this._launchOptions = options;
        this.loadAsset({ url: 'manifest.json' }, function (asset) {
            var manifest = _this._manifest = asset;
            var entryScene = manifest.scene.entryScene;
            _this.launchScene(entryScene, {}, onProgress, onComplete);
        });
    };
    /**
     * 预加载场景
     * @param name
     * @param onProgress
     * @param onComplete
     */
    Application.prototype.preloadScene = function (name, onProgress, onComplete) {
        this.loadScene(name, onProgress, onComplete);
    };
    /**
     * 加载场景
     * @param name
     * @param onProgress
     * @param onComplete
     */
    Application.prototype.loadScene = function (name, onProgress, onComplete) {
        var _this = this;
        var scenes = this._manifest.scene.scenes;
        if (this._docCaches[name]) {
            var scene = this._instantiateScene(this._docCaches[name]);
            onComplete(scene);
            return;
        }
        var sceneUrl = scenes[name];
        this.loadAsset({ url: sceneUrl, options: { xhrType: 'text' } }, function (asset) {
            var doc = parseViewDoc(_this, asset);
            _this._docCaches[name] = doc;
            _this.loadAssets(doc.assets, onProgress, function () {
                var scene = _this._instantiateScene(doc);
                onComplete(scene);
            });
        });
    };
    Application.prototype._instantiateScene = function (doc) {
        return this.instantiate(doc);
    };
    /**
     * 启动场景
     * @param name
     * @param options
     * @param onProgress
     * @param onComplete
     */
    Application.prototype.launchScene = function (name, options, onProgress, onComplete) {
        var _this = this;
        this.loadScene(name, onProgress, function (scene) {
            _this.addDisplayNode(scene, _this.stage);
            onComplete && onComplete();
        });
    };
    /**
     * 装配适配器
     * @param options
     * @return mainLoop 主循环方法
     */
    Application.prototype.setupAdaptor = function (options) {
        this._adaptorOptions = options;
        return this._mainLoop;
    };
    /**
     * 实例化场景或者预制体
     * @param doc
     */
    Application.prototype.instantiate = function (doc) {
        return instantiate(this, doc);
    };
    /**
     * 注册组件类
     * @param id
     * @param def
     */
    Application.prototype.registerComponentDef = function (id, def) {
        if (def) {
            def['__class__'] = id;
            this._componentDefs[id] = def;
        }
    };
    /**
     * 批量注册组件类
     * @param defs {key: id, def}
     */
    Application.prototype.registerComponentDefs = function (defs) {
        if (defs) {
            for (var id in defs) {
                this.registerComponentDef(id, defs[id]);
            }
        }
    };
    /**
     * 注册实体类
     * @param type
     * @param def
     */
    Application.prototype.registerEntityDef = function (type, def) {
        if (def) {
            this._entityDefs[type] = def;
        }
    };
    /**
     * 批量注册实体类
     * @param defs
     */
    Application.prototype.registerEntityDefs = function (defs) {
        if (defs) {
            for (var type in defs) {
                this.registerEntityDef(type, defs[type].def);
            }
        }
    };
    /**
     * 创建实体实例
     * @param type
     */
    Application.prototype.createEntity = function (type) {
        var clazz = this._entityDefs[type];
        if (clazz) {
            var entity = new clazz();
            var entityAdaptor = new this._adaptorOptions.EntityAdaptor(entity, this);
            return entity;
        }
        else {
            throw new Error("type [" + type + "] not exists.");
        }
    };
    Object.defineProperty(Application.prototype, "entityDefs", {
        /**
         * 获取全部已注册的实体定义
         */
        get: function () {
            return this._entityDefs;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 添加显示节点
     * @param node
     * @param parent
     */
    Application.prototype.addDisplayNode = function (node, parent) {
        this._adaptorOptions.addDisplayFunc(node, parent);
    };
    /**
     * 遍历显示节点
     * @param node
     * @param callback
     */
    Application.prototype.traverseDisplayNode = function (node, callback) {
        this._adaptorOptions.traverseFunc(node, callback);
    };
    /**
     * 冒泡显示节点
     * @param node
     * @param callback
     */
    Application.prototype.bubblingDisplayNode = function (node, callback) {
        this._adaptorOptions.bubblingFunc(node, callback);
    };
    /**
     * 加载单项资源
     * @param config
     * @param onComplete
     */
    Application.prototype.loadAsset = function (config, onComplete) {
        var _this = this;
        this._adaptorOptions.loadAssetFunc(config, function (item, opt) {
            _this._assetsManager.addAsset(item, opt);
            onComplete && onComplete(item);
        });
    };
    /**
     * 加载资源
     * @param configs
     * @param onProgress
     * @param onComplete
     */
    Application.prototype.loadAssets = function (configs, onProgress, onComplete) {
        var total = configs.length;
        var loaded = 0;
        for (var _i = 0, configs_1 = configs; _i < configs_1.length; _i++) {
            var config = configs_1[_i];
            this.loadAsset(config, onItemComplete);
        }
        function onItemComplete(item) {
            loaded++;
            onProgress && onProgress(loaded, total, item);
            if (loaded >= total) {
                onComplete && onComplete();
            }
        }
    };
    /**
     * 获取资源
     * @param uuid
     */
    Application.prototype.getAsset = function (uuid) {
        return this._assetsManager.getAsset(uuid);
    };
    /**
     * 遍历整个渲染树
     * @param delta
     * @param node
     * @private
     */
    Application.prototype._onHit = function (delta, node) {
        if (node['entityAdaptor']) {
            var entityAdaptor = node['entityAdaptor'];
            entityAdaptor.invokeLifecycle('update', delta);
        }
    };
    /**
     * 实例化组件
     * @param id
     */
    Application.prototype.$getComponentDef = function (id) {
        var def;
        var idType = typeof id;
        switch (idType) {
            case 'string':
                def = this._componentDefs[id];
                break;
            case 'function':
                def = id;
                break;
        }
        if (!def) {
            console.warn("component [" + id + "] not exists.");
            return;
        }
        var className = def['__class__'];
        if (!className) {
            console.warn("component [" + id + "] is not registered.");
            return;
        }
        return def;
    };
    return Application;
}());
//# sourceMappingURL=Application.js.map

/**
 * Created by rockyl on 2019-07-28.
 */
/**
 * 组件类
 */
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        var _this = _super.call(this) || this;
        _this._enabled = false;
        _this._started = false;
        return _this;
    }
    Object.defineProperty(Component.prototype, "entityAdaptor", {
        get: function () {
            return this._entityAdaptor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "entity", {
        get: function () {
            return this._entityAdaptor.entity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "enabled", {
        /**
         * 是否有效
         */
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            if (this._enabled != value) {
                this._enabled = value;
                if (this._entityAdaptor && this._entityAdaptor.getActive()) {
                    if (value) {
                        this._started = false;
                        this.onEnable();
                    }
                    else {
                        this.onDisable();
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    Component.prototype.$awake = function (entityAdaptor) {
        this._entityAdaptor = entityAdaptor;
        this.awake();
    };
    /**
     * @private
     */
    Component.prototype.$destroy = function () {
        this._entityAdaptor = null;
        this.onDestroy();
    };
    /**
     * 当组件被唤醒时
     */
    Component.prototype.awake = function () {
    };
    /**
     * 当组件开始
     */
    Component.prototype.start = function () {
    };
    /**
     * 当生效时
     * 仅当实体唤醒状态
     */
    Component.prototype.onEnable = function () {
    };
    /**
     * 当失效时
     * 仅当实体唤醒状态
     */
    Component.prototype.onDisable = function () {
    };
    /**
     * 时钟更新
     * @param delta
     */
    Component.prototype.update = function (delta) {
    };
    /**
     * 当被销毁时
     */
    Component.prototype.onDestroy = function () {
    };
    /**
     * @private
     * @param delta
     */
    Component.prototype.$onUpdate = function (delta) {
        if (this._enabled) {
            if (!this._started) {
                this._started = true;
                this.start();
            }
            this.update(delta);
        }
    };
    /**
     * 当点击时
     * @param e
     */
    Component.prototype.onClick = function (e) {
    };
    /**
     * 当鼠标按下
     * @param e
     */
    Component.prototype.onMouseDown = function (e) {
    };
    /**
     * 当鼠标移动
     * @param e
     */
    Component.prototype.onMouseMove = function (e) {
    };
    /**
     * 当鼠标松开
     * @param e
     */
    Component.prototype.onMouseUp = function (e) {
    };
    /**
     * 当鼠标在实体外侧松开
     * @param e
     */
    Component.prototype.onMouseUpOutside = function (e) {
    };
    /**
     * 向下广播执行
     * @param methodName
     * @param args
     */
    Component.prototype.broadcast = function (methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._entityAdaptor.app.traverseDisplayNode(this.entity, function (node) {
            node.invokeOnComponents && node.invokeOnComponents(methodName, args);
        });
    };
    /**
     * 向上冒泡执行
     * @param methodName
     * @param args
     */
    Component.prototype.bubbling = function (methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._entityAdaptor.app.bubblingDisplayNode(this.entity, function (node) {
            node.invokeOnComponents && node.invokeOnComponents(methodName, args);
        });
    };
    Component.prototype.addComponent = function (componentId, enabled) {
        return this.entity.addComponent(componentId, enabled);
    };
    Component.prototype.getAllComponents = function () {
        return this.entity.getAllComponents();
    };
    Component.prototype.getComponent = function (componentId) {
        return this.entity.getComponent(componentId);
    };
    Component.prototype.getComponents = function (componentId) {
        return this.entity.getComponents(componentId);
    };
    Component.prototype.removeAllComponents = function () {
        return this.entity.removeAllComponents();
    };
    Component.prototype.removeComponent = function (componentId, index) {
        return this.entity.removeComponent(componentId, index);
    };
    return Component;
}(HashObject));
//# sourceMappingURL=Component.js.map

/**
 * Created by rockyl on 2019-07-29.
 */
/**
 * 组件管理类
 */
var ComponentManager = /** @class */ (function () {
    function ComponentManager(entityAdaptor, app) {
        this._components = [];
        this._app = app;
        this._entityAdaptor = entityAdaptor;
        this.applyProxy();
    }
    ComponentManager.prototype.applyProxy = function () {
        var _this = this;
        var entity = this._entityAdaptor.entity;
        Object.defineProperty(entity, 'stage', {
            get: function () {
                return this.entityAdaptor.app.stage;
            }
        });
        entity.addComponent = function (componentId, enabled) {
            if (enabled === void 0) { enabled = true; }
            return _this.addComponent(componentId, true, enabled);
        };
        entity.removeComponent = function (componentId, index) {
            return _this.removeComponent(componentId, index);
        };
        entity.removeAllComponents = function () {
            _this.removeAllComponents();
        };
        entity.getComponent = function (componentId) {
            return _this.getComponent(componentId);
        };
        entity.getComponents = function (componentId) {
            return _this.getComponents(componentId);
        };
        entity.getAllComponents = function () {
            return _this.getAllComponents();
        };
        entity.invokeOnComponents = function (methodName, args) {
            return _this.invokeOnComponents(methodName, args);
        };
    };
    /**
     * 遍历组件
     * @param callback
     */
    ComponentManager.prototype.eachComponent = function (callback) {
        this._components.some(callback);
    };
    /**
     * 设置激活状态
     * @param active
     */
    ComponentManager.prototype.setActive = function (active) {
        this.eachComponent(function (component) {
            if (component.enabled) {
                if (active) {
                    component.onEnable();
                }
                else {
                    component.onDisable();
                }
            }
        });
    };
    /**
     * 时钟更新
     * @param t
     */
    ComponentManager.prototype.onUpdate = function (t) {
        this.eachComponent(function (component) {
            if (component.enabled) {
                component.$onUpdate(t);
            }
        });
    };
    /**
     * 交互事件
     */
    ComponentManager.prototype.onInteract = function (type, e) {
        this.eachComponent(function (component) {
            if (component.enabled) {
                var method = 'on' + type[0].toUpperCase() + type.substr(1);
                if (component[method]) {
                    component[method](e);
                }
            }
        });
    };
    /**
     * 添加组件
     * @param componentId
     * @param awake
     * @param enabled
     */
    ComponentManager.prototype.addComponent = function (componentId, awake, enabled) {
        if (awake === void 0) { awake = true; }
        if (enabled === void 0) { enabled = false; }
        var component = this.$instantiateComponent(componentId);
        if (!component) {
            return;
        }
        if (enabled) {
            component.enabled = true;
        }
        this._add(component, undefined, awake);
        return component;
    };
    /**
     * 移除组件
     * @param componentId
     * @param index
     */
    ComponentManager.prototype.removeComponent = function (componentId, index) {
        if (index === void 0) { index = 0; }
        var components;
        switch (typeof componentId) {
            case 'string':
                components = this._findByName(componentId);
                break;
            case 'function':
                components = this._find(componentId);
                break;
        }
        if (index !== undefined) {
            components = [components[index]];
        }
        this._remove(components);
        return components;
    };
    /**
     * 移除所有组件
     */
    ComponentManager.prototype.removeAllComponents = function () {
        this._removeAll();
    };
    /**
     * 获取组件
     * @param componentId
     */
    ComponentManager.prototype.getComponent = function (componentId) {
        switch (typeof componentId) {
            case 'string':
                return this._getByName(componentId);
            case 'function':
                return this._getOne(componentId);
        }
    };
    /**
     * 获取组件组
     * @param componentId
     */
    ComponentManager.prototype.getComponents = function (componentId) {
        switch (typeof componentId) {
            case 'string':
                return this._findByName(componentId);
            case 'function':
                return this._find(componentId);
        }
    };
    /**
     * 获取全部组件
     */
    ComponentManager.prototype.getAllComponents = function () {
        return this.all;
    };
    /**
     * 添加组件
     * @param component
     * @param index
     * @param awake
     */
    ComponentManager.prototype._add = function (component, index, awake) {
        if (awake === void 0) { awake = true; }
        if (index == undefined || index < 0 || index >= this._components.length) {
            index = this._components.length;
        }
        if (component.entityAdaptor == this._entityAdaptor) {
            index--;
        }
        var currentIndex = this._components.indexOf(component);
        if (currentIndex == index) {
            return;
        }
        if (currentIndex >= 0) {
            this._components.splice(currentIndex, 1);
        }
        this._components.splice(index, 0, component);
        if (currentIndex < 0) {
            this.$onAddComponent(component, awake);
        }
    };
    /**
     * 移除组件
     * @param components
     */
    ComponentManager.prototype._remove = function (components) {
        for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
            var component = components_1[_i];
            if (component) {
                this.$onRemoveComponent(component);
                var index = this._components.indexOf(component);
                this._components.splice(index, 1);
            }
        }
    };
    /**
     * 移除所有组件
     */
    ComponentManager.prototype._removeAll = function () {
        while (this._components.length > 0) {
            var component = this._components.shift();
            this.$onRemoveComponent(component);
        }
    };
    /**
     * 根据组件名称获取指定类的组件列表
     * @param componentId
     */
    ComponentManager.prototype._findByName = function (componentId) {
        var components = this._componentsNameMapping[componentId];
        if (!components) {
            components = this._componentsNameMapping[componentId] = this._components.filter(function (component) {
                return component.constructor['__class__'] === componentId;
            });
        }
        return components;
    };
    /**
     * 获取指定类的组件列表
     * @param clazz
     */
    ComponentManager.prototype._find = function (clazz) {
        var components = this._componentsDefMapping[clazz.name];
        if (!components) {
            components = this._componentsDefMapping[clazz.name] = this._components.filter(function (component) {
                return component instanceof clazz;
            });
        }
        return components;
    };
    /**
     * 获取指定类的组件
     * @param name
     */
    ComponentManager.prototype._getByName = function (name) {
        return this._findByName(name)[0];
    };
    /**
     * 获取指定类的组件
     * @param clazz
     */
    ComponentManager.prototype._getOne = function (clazz) {
        return this._find(clazz)[0];
    };
    Object.defineProperty(ComponentManager.prototype, "all", {
        /**
         * 获取所有组件
         */
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 调用组件上的方法
     * @param methodName
     * @param args
     */
    ComponentManager.prototype.invokeOnComponents = function (methodName, args) {
        this.eachComponent(function (component) {
            //if (component.enabled) {
            if (component[methodName]) {
                component[methodName].apply(component, args);
            }
            //}
        });
    };
    /**
     * 当添加组件时
     * @param component
     * @param awake
     */
    ComponentManager.prototype.$onAddComponent = function (component, awake) {
        if (awake === void 0) { awake = true; }
        this._componentsNameMapping = {};
        this._componentsDefMapping = {};
        if (awake) {
            component.$awake(this._entityAdaptor);
        }
    };
    /**
     * 当移除组件时
     * @param component
     */
    ComponentManager.prototype.$onRemoveComponent = function (component) {
        this._componentsNameMapping = {};
        this._componentsDefMapping = {};
        component.enabled = false;
        component.$destroy();
    };
    ComponentManager.prototype.$instantiateComponent = function (componentId) {
        var def = this._app.$getComponentDef(componentId);
        return new def();
    };
    return ComponentManager;
}());
//# sourceMappingURL=ComponentManager.js.map

/**
 * Created by rockyl on 2018/11/9.
 *
 * 属性装饰器
 */
/**
 * 属性修改时触发
 * @param onModify
 */
function fieldChanged(onModify) {
    return function (target, key) {
        var privateKey = '_' + key;
        Object.defineProperty(target, key, {
            enumerable: true,
            get: function () {
                return this[privateKey];
            },
            set: function (v) {
                var oldValue = this[privateKey];
                if (oldValue !== v) {
                    this[privateKey] = v;
                    onModify.apply(this, [v, key, oldValue]);
                }
            }
        });
    };
}
/**
 * 属性变脏时设置宿主的dirty属性为true
 */
var dirtyFieldDetector = fieldChanged(function (value, key, oldValue) {
    this['__fieldDirty'] = true;
});
/**
 * 深度属性变脏时设置宿主的dirty属性为true
 */
var deepDirtyFieldDetector = fieldChanged(function (value, key, oldValue) {
    var scope = this;
    scope['__fieldDirty'] = true;
    if (typeof value === 'object') {
        if (value.hasOwnProperty('onChange')) {
            value['onChange'] = this['$onModify'];
        }
        else {
            mutateObject(value, onChange);
        }
    }
    function onChange() {
        scope['__fieldDirty'] = true;
    }
});
/**
 * 属性变脏时触发onModify方法
 */
var dirtyFieldTrigger = fieldChanged(function (value, key, oldValue) {
    this['$onModify'] && this['$onModify'](value, key, oldValue);
});
/**
 * 深入属性变脏时触发onModify方法
 */
var deepDirtyFieldTrigger = fieldChanged(function (value, key, oldValue) {
    var onModify = this['$onModify'];
    var scope = this;
    if (onModify) {
        onModify.call(scope, value, key, oldValue);
        if (typeof value === 'object') {
            if (value.hasOwnProperty('onChange')) {
                value['onChange'] = onChange;
            }
            else {
                mutateObject(value, onChange);
            }
        }
    }
    function onChange(_value, _key, _oldValue) {
        onModify.call(scope, value, key, oldValue, _key);
    }
});
function mutateObject(data, onChange) {
    if (!data['__mutated__']) {
        for (var key in data) {
            mutateProp(data, key, data[key], onChange);
        }
        Object.defineProperty(data, "__mutated__", {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
    }
}
function mutateProp(data, key, value, onChange) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function () {
            return value;
        },
        set: function (v) {
            var oldValue = value;
            if (v == value)
                return;
            value = v;
            onChange(value, key, oldValue);
        }
    });
}
//# sourceMappingURL=dirty-field.js.map

/**
 * Created by rockyl on 2020-04-01.
 */
/**
 * 隐藏的属性
 */
function hidden() {
}
//# sourceMappingURL=editor.js.map

/**
 * Created by rockyl on 2018/11/6.
 *
 */
/**
 * 2D矢量
 */
var Vector2 = /** @class */ (function (_super) {
    __extends(Vector2, _super);
    /**
     * 创建一个2D矢量
     * @param x x分量
     * @param y y分量
     * @param onChange 当改变时触发
     */
    function Vector2(x, y, onChange) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this.onChange = onChange;
        _this.setXY(x, y);
        return _this;
    }
    Vector2.prototype.$onModify = function (value, key, oldValue) {
        this.onChange && this.onChange(value, key, oldValue);
    };
    /**
     * 设置分量
     * @param x
     * @param y
     */
    Vector2.prototype.setXY = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
        return this;
    };
    /**
     * 从一个向量拷贝分量
     * @param v2
     */
    Vector2.prototype.copyFrom = function (v2) {
        this.x = v2.x;
        this.y = v2.y;
        return this;
    };
    /**
     * 克隆出一个向量
     */
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    /**
     * 把向量置空
     */
    Vector2.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    Object.defineProperty(Vector2.prototype, "isZero", {
        /**
         * 是不是一个0向量
         */
        get: function () {
            return this.x == 0 && this.y == 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 单位化向量
     */
    Vector2.prototype.normalize = function () {
        var len = this.length;
        if (len == 0) {
            this.x = 1;
            return this;
        }
        this.x /= len;
        this.y /= len;
        return this;
    };
    Object.defineProperty(Vector2.prototype, "isNormalized", {
        /**
         * 是不是一个单位向量
         */
        get: function () {
            return this.length == 1.0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 截取向量长度
     * @param max
     */
    Vector2.prototype.truncate = function (max) {
        this.length = Math.min(max, this.length);
        return this;
    };
    /**
     * 向量反向
     */
    Vector2.prototype.reverse = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    /**
     * 获取点乘
     * @param v2
     */
    Vector2.prototype.dotProd = function (v2) {
        return this.x * v2.x + this.y * v2.y;
    };
    /**
     * 获取叉乘
     * @param v2
     */
    Vector2.prototype.crossProd = function (v2) {
        return this.x * v2.y - this.y * v2.x;
    };
    /**
     * 获取长度的平方
     * @param v2
     */
    Vector2.prototype.distSQ = function (v2) {
        var dx = v2.x - this.x;
        var dy = v2.y - this.y;
        return dx * dx + dy * dy;
    };
    /**
     * 获取两个向量的距离
     * @param v2
     */
    Vector2.prototype.distance = function (v2) {
        return Math.sqrt(this.distSQ(v2));
    };
    /**
     * 向量加法
     * @param v2
     */
    Vector2.prototype.add = function (v2) {
        this.x += v2.x;
        this.y += v2.y;
        return this;
    };
    /**
     * 向量减法
     * @param v2
     */
    Vector2.prototype.subtract = function (v2) {
        this.x -= v2.x;
        this.y -= v2.y;
        return this;
    };
    /**
     * 向量乘于某个数
     * @param value
     */
    Vector2.prototype.multiply = function (value) {
        this.x *= value;
        this.y *= value;
        return this;
    };
    /**
     * 向量除于某个数
     * @param value
     */
    Vector2.prototype.divide = function (value) {
        this.x /= value;
        this.y /= value;
        return this;
    };
    Object.defineProperty(Vector2.prototype, "angle", {
        get: function () {
            return this.radian * 180 / Math.PI;
        },
        /**
         * 向量角度
         * @param value
         */
        set: function (value) {
            this.radian = value * Math.PI / 180;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "radian", {
        get: function () {
            return Math.atan2(this.y, this.x);
        },
        /**
         * 向量弧度
         * @param value
         */
        set: function (value) {
            var len = this.length;
            this.setXY(Math.cos(value) * len, Math.sin(value) * len);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 是否等于某个向量
     * @param v2
     */
    Vector2.prototype.equals = function (v2) {
        return this.x == v2.x && this.y == v2.y;
    };
    Object.defineProperty(Vector2.prototype, "length", {
        /**
         * 向量长度
         * @param value
         */
        get: function () {
            return Math.sqrt(this.lengthSQ);
        },
        set: function (value) {
            var a = this.radian;
            this.setXY(Math.cos(a) * value, Math.sin(a) * value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "lengthSQ", {
        /**
         * 获取向量长度的平方
         */
        get: function () {
            return this.x * this.x + this.y * this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "slope", {
        /**
         * 获取向量斜率
         */
        get: function () {
            return this.y / this.x;
        },
        enumerable: true,
        configurable: true
    });
    Vector2.prototype.toString = function () {
        return "[Vector2 (x:" + this.x + ", y:" + this.y + ")]";
    };
    Vector2.prototype.toObj = function () {
        return { x: this.x, y: this.y };
    };
    Vector2.prototype.toArray = function () {
        return [this.x, this.y];
    };
    Vector2.corner = function (v1, v2) {
        return Math.acos(v1.dotProd(v2) / (v1.length * v2.length));
    };
    __decorate([
        dirtyFieldTrigger
    ], Vector2.prototype, "x", void 0);
    __decorate([
        dirtyFieldTrigger
    ], Vector2.prototype, "y", void 0);
    return Vector2;
}(HashObject));
//# sourceMappingURL=vectors.js.map

/**
 * Created by rockyl on 2020-03-07.
 */
/**
 * 实体适配器基类
 */
var EntityAdaptorBase = /** @class */ (function () {
    function EntityAdaptorBase(entity, app) {
        this._entity = entity;
        this._app = app;
        this._components = new ComponentManager(this, app);
        entity.entityAdaptor = this;
        this.applyProxy();
    }
    Object.defineProperty(EntityAdaptorBase.prototype, "components", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityAdaptorBase.prototype, "entity", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._entity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityAdaptorBase.prototype, "app", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EntityAdaptorBase.prototype.getActive = function () {
        return this._entity.$active;
    };
    /**
     * @inheritDoc
     */
    EntityAdaptorBase.prototype.setActive = function (v) {
        if (v !== this.getActive()) {
            this._entity.$active = v;
            this._components.setActive(v);
        }
    };
    /**
     * 应用代理
     */
    EntityAdaptorBase.prototype.applyProxy = function () {
        var _this = this;
        var entity = this._entity;
        entity.$active = false;
        Object.defineProperty(entity, 'active', {
            get: function () {
                return this.entityAdaptor.getActive();
            }
        });
        entity.instantiate = function (docType) {
            return _this._app.instantiate(docType);
        };
        entity.setActive = this.setActive.bind(this);
    };
    /**
     * 触发生命周期方法
     * @param type
     * @param args
     */
    EntityAdaptorBase.prototype.invokeLifecycle = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.getActive()) {
            return;
        }
        switch (type) {
            case 'update':
                var delta = args[0];
                this._components.onUpdate(delta);
                break;
        }
    };
    /**
     * 触发交互事件方法
     * @param type
     * @param e
     */
    EntityAdaptorBase.prototype.invokeInteractionEvent = function (type, e) {
        if (!this.getActive()) {
            return;
        }
        this._components.onInteract(type, e);
    };
    return EntityAdaptorBase;
}());
//# sourceMappingURL=EntityAdaptor.js.map

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
function lerp(begin, end, t, allowOutOfBounds) {
    if (allowOutOfBounds === void 0) { allowOutOfBounds = false; }
    if (!allowOutOfBounds) {
        t = Math.max(0, Math.min(1, t));
    }
    var sign = end - begin;
    sign = sign > 0 ? 1 : (sign < 0 ? -1 : 0);
    var distance = Math.abs(end - begin);
    return begin + distance * t * sign;
}
/**
 * 线性插值
 * @param begin
 * @param end
 * @param t number
 * @param allowOutOfBounds
 * @return number
 */
function lerpVector2(begin, end, t, allowOutOfBounds) {
    if (allowOutOfBounds === void 0) { allowOutOfBounds = false; }
    return {
        x: lerp(begin.x, end.x, t, allowOutOfBounds),
        y: lerp(begin.y, end.y, t, allowOutOfBounds),
    };
}
/**
 * 线性插值
 * @param begin
 * @param end
 * @param t number
 * @param allowOutOfBounds
 * @return number
 */
function lerpVector3(begin, end, t, allowOutOfBounds) {
    if (allowOutOfBounds === void 0) { allowOutOfBounds = false; }
    return {
        x: lerp(begin.x, end.x, t, allowOutOfBounds),
        y: lerp(begin.y, end.y, t, allowOutOfBounds),
        z: lerp(begin.z, end.z, t, allowOutOfBounds),
    };
}
/**
 * json5字符串转对象
 * @param str
 */
function decodeJson5(str) {
    var func = new Function('return ' + str);
    try {
        return func();
    }
    catch (e) {
        console.warn(e);
    }
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
function injectProp(target, data, callback, ignoreMethod, ignoreNull) {
    if (ignoreMethod === void 0) { ignoreMethod = true; }
    if (ignoreNull === void 0) { ignoreNull = true; }
    if (!target || !data) {
        return false;
    }
    var result = false;
    for (var key in data) {
        var value = data[key];
        if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)) {
            if (callback) {
                callback(target, key, value);
            }
            else {
                try {
                    target[key] = value;
                }
                catch (e) {
                }
            }
            result = true;
        }
    }
    return result;
}
/**
 * 属性拷贝
 * @param target
 * @param data
 * @param schema
 */
function copyProp(target, data, schema) {
    if (schema) {
        for (var key in schema) {
            var valueConfig = schema[key];
            if (Array.isArray(valueConfig)) {
                target[key] = {};
                for (var _i = 0, valueConfig_1 = valueConfig; _i < valueConfig_1.length; _i++) {
                    var field = valueConfig_1[_i];
                    target[key][field] = data[key][field];
                }
            }
            else if (typeof valueConfig === 'string') {
                target[valueConfig] = data[valueConfig];
            }
            else if (typeof valueConfig === 'object') {
                target[key] = {};
                copyProp(target[key], data[key], valueConfig);
            }
        }
    }
}
/**
 * 对象转搜索字符串
 * @param obj
 */
function objectStringify(obj) {
    if (!obj) {
        return '';
    }
    var arr = [];
    for (var key in obj) {
        arr.push(key + '=' + obj[key]);
    }
    return arr.join('&');
}
//# sourceMappingURL=utils.js.map

var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob:
    'FileReader' in self &&
    'Blob' in self &&
    (function() {
      try {
        new Blob();
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ];

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    };
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value}
    }
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    };
  }

  return iterator
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function(name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null
};

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
};

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function() {
  var items = [];
  this.forEach(function(value, name) {
    items.push(name);
  });
  return iteratorFor(items)
};

Headers.prototype.values = function() {
  var items = [];
  this.forEach(function(value) {
    items.push(value);
  });
  return iteratorFor(items)
};

Headers.prototype.entries = function() {
  var items = [];
  this.forEach(function(value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items)
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = function() {
      reject(reader.error);
    };
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function(body) {
    this._bodyInit = body;
    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer);
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
      }
    }
  };

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    };

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    };
  }

  this.text = function() {
    var rejected = consumed(this);
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  };

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    };
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  };

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url;
    this.credentials = input.credentials;
    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }
    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;
    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || 'same-origin';
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }
  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body);
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
};

function decode(body) {
  var form = new FormData();
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':');
    var key = parts.shift().trim();
    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers
}

Body.call(Request.prototype);

function Response(bodyInit, options) {
  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = 'statusText' in options ? options.statusText : 'OK';
  this.headers = new Headers(options.headers);
  this.url = options.url || '';
  this._initBody(bodyInit);
}

Body.call(Response.prototype);

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
};

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''});
  response.type = 'error';
  return response
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
};

var DOMException = self.DOMException;
try {
  new DOMException();
} catch (err) {
  DOMException = function(message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };
  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch$1(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, options));
    };

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'));
    };

    xhr.ontimeout = function() {
      reject(new TypeError('Network request failed'));
    };

    xhr.onabort = function() {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob';
    }

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  })
}

fetch$1.polyfill = true;

if (!self.fetch) {
  self.fetch = fetch$1;
  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;
}

/**
 * Created by rockyl on 2020-05-15.
 */
/**
 * 调用接口
 * @param uri
 * @param params
 * @param contentType
 * @param responseType
 * @param credentials
 */
function callApi(uri, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.host, host = _c === void 0 ? '' : _c, _d = _b.params, params = _d === void 0 ? null : _d, _e = _b.method, method = _e === void 0 ? 'get' : _e, _f = _b.credentials, credentials = _f === void 0 ? 'include' : _f, _g = _b.contentType, contentType = _g === void 0 ? 'json' : _g;
    var url = host + (uri.startsWith('http') || uri.startsWith('//') ? uri : uri);
    var options = {
        method: method,
        headers: {},
        credentials: credentials,
    };
    if (params) {
        if (method.toLowerCase() === 'post') {
            switch (contentType) {
                case 'form-data':
                    var formData = new FormData();
                    for (var key in params) {
                        var value = params[key];
                        if (value instanceof File) {
                            formData.append(key, value, value.name);
                        }
                        else {
                            formData.append(key, value);
                        }
                    }
                    options.body = formData;
                    break;
                case 'form':
                    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    options.body = objectStringify(params);
                    break;
                case 'json':
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(params);
                    break;
            }
        }
        else {
            url += (url.indexOf('?') < 0 ? '?' : '');
            url += (url.endsWith('?') ? '' : '&') + objectStringify(params);
        }
    }
    return fetch(url, options)
        .then(function (response) {
        return response.text();
    })
        .then(function (respText) {
        try {
            var jsonObj = JSON.parse(respText);
            if (jsonObj.code === 0) {
                return jsonObj.data;
            }
            return Promise.reject(new Error('call api failed'));
        }
        catch (e) {
            return Promise.reject(e);
        }
    });
}
//# sourceMappingURL=http-request.js.map

export { Application, Component, ComponentManager, EntityAdaptorBase, HashObject, QunityEvent, Vector2, callApi, copyProp, decodeJson5, deepDirtyFieldDetector, deepDirtyFieldTrigger, dirtyFieldDetector, dirtyFieldTrigger, fieldChanged, hidden, injectProp, lerp, lerpVector2, lerpVector3, objectStringify };
//# sourceMappingURL=bundle.esm.js.map
