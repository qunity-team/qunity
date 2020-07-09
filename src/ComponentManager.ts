/**
 * Created by rockyl on 2019-07-29.
 */

import {Component} from "./Component";
import {IEntityAdaptor} from "./EntityAdaptor";
import {Application} from "./Application";

/**
 * 组件管理类
 */
export class ComponentManager {
	private _app: Application;
	private _entityAdaptor: IEntityAdaptor;
	private _components: Component[] = [];
	private _componentsNameMapping: any;
	private _componentsDefMapping: any;

	constructor(entityAdaptor: IEntityAdaptor, app: Application) {
		this._app = app;
		this._entityAdaptor = entityAdaptor;

		this.applyProxy();
	}

	applyProxy() {
		let entity = this._entityAdaptor.entity;

		Object.defineProperty(entity, 'stage', {
			get() {
				return this.entityAdaptor.app.stage;
			}
		});
		entity.addComponent = (componentId: string | Function, enabled: boolean = true) => {
			return this.addComponent(componentId, true, enabled);
		};
		entity.removeComponent = (componentId: string | Function, index?: number) => {
			return this.removeComponent(componentId, index);
		};
		entity.removeAllComponents = () => {
			this.removeAllComponents();
		};
		entity.getComponent = (componentId: string | Function) => {
			return this.getComponent(componentId);
		};
		entity.getComponents = (componentId: string | Function) => {
			return this.getComponents(componentId);
		};
		entity.getAllComponents = () => {
			return this.getAllComponents();
		};
		entity.invokeOnComponents = (methodName: string, args) => {
			return this.invokeOnComponents(methodName, args);
		};
	}

	/**
	 * 遍历组件
	 * @param callback
	 */
	eachComponent(callback: (component: Component, index: number) => unknown) {
		this._components.some(<any>callback);
	}

	/**
	 * 设置激活状态
	 * @param active
	 */
	setActive(active: boolean) {
		this.eachComponent(component => {
			if (component.enabled) {
				if (active) {
					component.onEnable();
				} else {
					component.onDisable();
				}
			}
		})
	}

	/**
	 * 时钟更新
	 * @param t
	 */
	onUpdate(t: number) {
		this.eachComponent(component => {
			if (component.enabled) {
				component.$onUpdate(t);
			}
		})
	}

	/**
	 * 交互事件
	 */
	onInteract(type: string, e) {
		this.eachComponent(component => {
			if (component.enabled) {
				let method = 'on' + type[0].toUpperCase() + type.substr(1);

				if (component[method]) {
					component[method](e);
				}
			}
		})
	}

	/**
	 * 添加组件
	 * @param componentId
	 * @param awake
	 * @param enabled
	 */
	addComponent(componentId: any, awake = true, enabled: boolean = false) {
		let component = this.$instantiateComponent(componentId);
		if (!component) {
			return;
		}

		if(enabled){
			component.enabled = true;
		}
		this._add(component, undefined, awake);

		return component;
	}

	/**
	 * 移除组件
	 * @param componentId
	 * @param index
	 */
	removeComponent(componentId: any, index: number = 0) {
		let components;
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
	}

	/**
	 * 移除所有组件
	 */
	removeAllComponents() {
		this._removeAll();
	}

	/**
	 * 获取组件
	 * @param componentId
	 */
	getComponent(componentId) {
		switch (typeof componentId) {
			case 'string':
				return this._getByName(componentId);
			case 'function':
				return this._getOne(componentId);
		}
	}

	/**
	 * 获取组件组
	 * @param componentId
	 */
	getComponents(componentId) {
		switch (typeof componentId) {
			case 'string':
				return this._findByName(componentId);
			case 'function':
				return this._find(componentId);
		}
	}

	/**
	 * 获取全部组件
	 */
	getAllComponents() {
		return this.all;
	}

	/**
	 * 添加组件
	 * @param component
	 * @param index
	 * @param awake
	 */
	private _add(component: Component, index?: number, awake = true) {

		if (index == undefined || index < 0 || index >= this._components.length) {
			index = this._components.length;
		}

		if (component.entityAdaptor == this._entityAdaptor) {
			index--;
		}

		const currentIndex = this._components.indexOf(component);
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
	}

	/**
	 * 移除组件
	 * @param components
	 */
	private _remove(components) {
		for (let component of components) {
			if (component) {
				this.$onRemoveComponent(component);
				const index = this._components.indexOf(component);
				this._components.splice(index, 1);
			}
		}
	}

	/**
	 * 移除所有组件
	 */
	private _removeAll() {
		while (this._components.length > 0) {
			const component = this._components.shift();
			this.$onRemoveComponent(component);
		}
	}

	/**
	 * 根据组件名称获取指定类的组件列表
	 * @param componentId
	 */
	private _findByName<T extends Component>(componentId: string): T[] {
		let components = this._componentsNameMapping[componentId];
		if (!components) {
			components = this._componentsNameMapping[componentId] = <T[]>this._components.filter((component: Component) => {
				return component.constructor['__class__'] === componentId;
			});
		}
		return components;
	}

	/**
	 * 获取指定类的组件列表
	 * @param clazz
	 */
	private _find<T extends Component>(clazz: new() => T): T[] {
		let components = this._componentsDefMapping[clazz.name];
		if (!components) {
			components = this._componentsDefMapping[clazz.name] = <T[]>this._components.filter((component: Component) => {
				return component instanceof clazz;
			});
		}
		return components;
	}

	/**
	 * 获取指定类的组件
	 * @param name
	 */
	private _getByName<T extends Component>(name: string): T {
		return this._findByName<T>(name)[0];
	}

	/**
	 * 获取指定类的组件
	 * @param clazz
	 */
	private _getOne<T extends Component>(clazz: new() => T): T {
		return this._find<T>(clazz)[0];
	}

	/**
	 * 获取所有组件
	 */
	private get all(): Component[] {
		return this._components;
	}

	/**
	 * 调用组件上的方法
	 * @param methodName
	 * @param args
	 */
	invokeOnComponents(methodName, args) {
		this.eachComponent(component => {
			//if (component.enabled) {
				if (component[methodName]) {
					component[methodName].apply(component, args);
				}
			//}
		})
	}

	/**
	 * 当添加组件时
	 * @param component
	 * @param awake
	 */
	$onAddComponent(component: Component, awake = true) {
		this._componentsNameMapping = {};
		this._componentsDefMapping = {};

		if (awake) {
			component.$awake(this._entityAdaptor);
		}
	}

	/**
	 * 当移除组件时
	 * @param component
	 */
	$onRemoveComponent(component: Component) {
		this._componentsNameMapping = {};
		this._componentsDefMapping = {};

		component.enabled = false;
		component.$destroy();
	}

	$instantiateComponent(componentId: any): Component {
		let def = this._app.$getComponentDef(componentId);
		return new def();
	}
}
