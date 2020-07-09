/**
 * Created by rockyl on 2020-03-07.
 */

import {ComponentManager} from "./ComponentManager";
import {Application} from "./Application";
import {IEntity} from "./IEntity";

/**
 * 实体适配器接口
 */
export interface IEntityAdaptor {
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
	setActive(active: boolean);

	invokeLifecycle(type: string, ...args);

	invokeInteractionEvent(type: string, ...args);
}

/**
 * 实体适配器基类
 */
export abstract class EntityAdaptorBase implements IEntityAdaptor {
	protected readonly _components: ComponentManager;
	protected readonly _entity: any;
	private _app: Application;

	/**
	 * @inheritDoc
	 */
	get components(): ComponentManager {
		return this._components;
	}

	/**
	 * @inheritDoc
	 */
	get entity() {
		return this._entity;
	}

	/**
	 * @inheritDoc
	 */
	get app() {
		return this._app;
	}

	/**
	 * @inheritDoc
	 */
	getActive(): boolean {
		return this._entity.$active;
	}

	/**
	 * @inheritDoc
	 */
	setActive(v: boolean) {
		if (v !== this.getActive()) {
			this._entity.$active = v;
			this._components.setActive(v);
		}
	}

	constructor(entity: any, app: Application) {
		this._entity = entity;
		this._app = app;
		this._components = new ComponentManager(this, app);

		entity.entityAdaptor = this;

		this.applyProxy();
	}

	/**
	 * 应用代理
	 */
	applyProxy() {
		let entity = this._entity;
		entity.$active = false;

		Object.defineProperty(entity, 'active', {
			get() {
				return this.entityAdaptor.getActive();
			}
		});
		entity.instantiate = (docType: any) => {
			return this._app.instantiate(docType);
		};
		entity.setActive = this.setActive.bind(this);
	}

	/**
	 * 触发生命周期方法
	 * @param type
	 * @param args
	 */
	invokeLifecycle(type: string, ...args) {
		if (!this.getActive()) {
			return;
		}

		switch (type) {
			case 'update':
				const [delta] = args;
				this._components.onUpdate(delta);
				break;
		}
	}

	/**
	 * 触发交互事件方法
	 * @param type
	 * @param e
	 */
	invokeInteractionEvent(type: string, e) {
		if (!this.getActive()) {
			return;
		}

		this._components.onInteract(type, e);
	}
}
