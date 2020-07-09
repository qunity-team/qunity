/**
 * Created by rockyl on 2020-03-09.
 */

import {IComponent} from "./Component";
import {IEntityAdaptor} from "./EntityAdaptor";

/**
 * 实体接口
 */
export interface IEntity {
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
	instantiate(docConfig: any);

	/**
	 * 设置激活状态
	 * @param active
	 */
	setActive(active: boolean);

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
	removeAllComponents();

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
	invokeOnComponents(methodName, ...args);
}
