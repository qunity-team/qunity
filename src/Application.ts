/**
 * Created by rockyl on 2020-03-08.
 */

import {IEntityAdaptor} from "./EntityAdaptor";
import {IEntity} from "./IEntity";
import {IDoc, instantiate, parseViewDoc} from "./interpreter";
import {AssetsManager} from "./assets-manager";

export interface AdaptorOptions {
	stage: any;
	EntityAdaptor: any;
	addDisplayFunc: (node: IEntity, parent: IEntity) => void;
	traverseFunc: (node: IEntity, callback: (node) => boolean | void) => void;
	bubblingFunc: (node: IEntity, callback: (node) => boolean | void) => void;
	loadAssetFunc: (config: any, onComplete: (res, opt) => void) => void;
	protocols?: {
		[key: string]: (app: Application, key: string, value: any, pid?: number) => any,
	};
	context?: any;
}

/**
 * 应用
 */
export class Application {
	private _launchOptions: any;
	private _adaptorOptions: AdaptorOptions;
	private _componentDefs: any = {};
	private _entityDefs: any = {};
	private _manifest: any;
	private _docCaches: any = {};
	private _assetsManager: AssetsManager;

	entityMap = {};

	/**
	 * 启动配置
	 */
	get launchOptions(): any {
		return this._launchOptions;
	}

	/**
	 * 适配配置
	 */
	get adaptorOptions(): AdaptorOptions {
		return this._adaptorOptions;
	}

	/**
	 * 获取上下文
	 */
	get context() {
		return this._adaptorOptions.context;
	}

	/**
	 * 舞台实例
	 */
	get stage() {
		return this._adaptorOptions.stage;
	}

	constructor() {
		this._assetsManager = new AssetsManager(this);
	}

	/**
	 * 启动
	 * @param options
	 * @param onProgress
	 * @param onComplete
	 */
	launch(options?: any, onProgress?, onComplete?) {
		this._launchOptions = options;
		this.loadAsset({url: 'manifest.json'},
			(asset) => {
				let manifest = this._manifest = asset;
				let entryScene = manifest.scene.entryScene;
				this.launchScene(entryScene, {}, onProgress, onComplete);
			})
	}

	/**
	 * 预加载场景
	 * @param name
	 * @param onProgress
	 * @param onComplete
	 */
	preloadScene(name: string, onProgress?, onComplete?) {
		this.loadScene(name, onProgress, onComplete);
	}

	/**
	 * 加载场景
	 * @param name
	 * @param onProgress
	 * @param onComplete
	 */
	private loadScene(name: string, onProgress?, onComplete?) {
		let scenes = this._manifest.scene.scenes;

		if (this._docCaches[name]) {
			let scene = this._instantiateScene(this._docCaches[name]);
			onComplete(scene);
			return;
		}

		let sceneUrl = scenes[name];
		this.loadAsset({url: sceneUrl, options: {xhrType: 'text'}},
			(asset) => {
				let doc = parseViewDoc(this, asset);
				this._docCaches[name] = doc;

				this.loadAssets(doc.assets, onProgress, () => {
					let scene = this._instantiateScene(doc);
					onComplete(scene);
				});
			});
	}

	_instantiateScene(doc:IDoc) {
		return this.instantiate(doc);
	}

	/**
	 * 启动场景
	 * @param name
	 * @param options
	 * @param onProgress
	 * @param onComplete
	 */
	launchScene(name: string, options?: any, onProgress?, onComplete?) {
		this.loadScene(name, onProgress, (scene) => {
			this.addDisplayNode(scene, this.stage);

			onComplete && onComplete();
		});
	}

	/**
	 * 装配适配器
	 * @param options
	 * @return mainLoop 主循环方法
	 */
	setupAdaptor(options: AdaptorOptions): (delta: number) => void {
		this._adaptorOptions = options;
		return this._mainLoop;
	}

	/**
	 * 实例化场景或者预制体
	 * @param doc
	 */
	instantiate(doc: IDoc) {
		return instantiate(this, doc);
	}

	/**
	 * 注册组件类
	 * @param id
	 * @param def
	 */
	registerComponentDef(id, def) {
		if (def) {
			def['__class__'] = id;
			this._componentDefs[id] = def;
		}
	}

	/**
	 * 批量注册组件类
	 * @param defs {key: id, def}
	 */
	registerComponentDefs(defs) {
		if (defs) {
			for (let id in defs) {
				this.registerComponentDef(id, defs[id]);
			}
		}
	}

	/**
	 * 注册实体类
	 * @param type
	 * @param def
	 */
	registerEntityDef(type, def) {
		if (def) {
			this._entityDefs[type] = def;
		}
	}

	/**
	 * 批量注册实体类
	 * @param defs
	 */
	registerEntityDefs(defs) {
		if (defs) {
			for (let type in defs) {
				this.registerEntityDef(type, defs[type].def);
			}
		}
	}

	/**
	 * 创建实体实例
	 * @param type
	 */
	createEntity(type: string): IEntity {
		let clazz = this._entityDefs[type];

		if (clazz) {
			let entity = new clazz();
			let entityAdaptor = new this._adaptorOptions.EntityAdaptor(entity, this);

			return entity;
		} else {
			throw new Error(`type [${type}] not exists.`)
		}
	}

	/**
	 * 获取全部已注册的实体定义
	 */
	get entityDefs() {
		return this._entityDefs;
	}

	/**
	 * 添加显示节点
	 * @param node
	 * @param parent
	 */
	addDisplayNode(node: IEntity, parent: IEntity) {
		this._adaptorOptions.addDisplayFunc(node, parent);
	}

	/**
	 * 遍历显示节点
	 * @param node
	 * @param callback
	 */
	traverseDisplayNode(node: IEntity, callback: (node) => boolean | void) {
		this._adaptorOptions.traverseFunc(node, callback);
	}

	/**
	 * 冒泡显示节点
	 * @param node
	 * @param callback
	 */
	bubblingDisplayNode(node: IEntity, callback: (node) => boolean | void) {
		this._adaptorOptions.bubblingFunc(node, callback);
	}

	/**
	 * 加载单项资源
	 * @param config
	 * @param onComplete
	 */
	loadAsset(config, onComplete?) {
		this._adaptorOptions.loadAssetFunc(config, (item, opt) => {
			this._assetsManager.addAsset(item, opt);
			onComplete && onComplete(item);
		});
	}

	/**
	 * 加载资源
	 * @param configs
	 * @param onProgress
	 * @param onComplete
	 */
	loadAssets(configs, onProgress?, onComplete?) {
		let total = configs.length;
		let loaded = 0;
		for (let config of configs) {
			this.loadAsset(config, onItemComplete)
		}

		function onItemComplete(item) {
			loaded++;
			onProgress && onProgress(loaded, total, item);
			if (loaded >= total) {
				onComplete && onComplete();
			}
		}
	}

	/**
	 * 获取资源
	 * @param uuid
	 */
	getAsset(uuid: string): any {
		return this._assetsManager.getAsset(uuid);
	}

	/**
	 * 主循环方法，需要在适配器的实现中调用
	 * @param delta
	 * @private
	 */
	private _mainLoop = (delta: number) => {
		this._adaptorOptions.traverseFunc(this._adaptorOptions.stage, this._onHit.bind(this, delta))
	};

	/**
	 * 遍历整个渲染树
	 * @param delta
	 * @param node
	 * @private
	 */
	private _onHit(delta, node) {
		if (node['entityAdaptor']) {
			let entityAdaptor: IEntityAdaptor = node['entityAdaptor'];
			entityAdaptor.invokeLifecycle('update', delta);
		}
	}

	/**
	 * 实例化组件
	 * @param id
	 */
	$getComponentDef(id: any): any {
		let def;
		let idType = typeof id;
		switch (idType) {
			case 'string':
				def = this._componentDefs[id];
				break;
			case 'function':
				def = id;
				break;
		}

		if (!def) {
			console.warn(`component [${id}] not exists.`);
			return;
		}
		const className = def['__class__'];
		if (!className) {
			console.warn(`component [${id}] is not registered.`);
			return;
		}

		return def;
	}
}
