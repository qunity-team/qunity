/**
 * Created by rockyl on 2020-04-07.
 */

import {HashObject} from "./HashObject";
import {Protocols, protocols} from "./protocols";

/**
 * 单一事件类
 * 一对多形式的订阅分发机制
 */
export class QunityEvent extends HashObject {
	private _subscribers: any[];

	constructor() {
		super();

		this._subscribers = [];
	}

	private findListener(callback) {
		const {_subscribers} = this;

		let result;
		for (let i = 0, li = _subscribers.length; i < li; i++) {
			const subscriber = _subscribers[i];

			if (subscriber.callback == callback) {
				result = {
					subscriber,
					index: i,
				};
				break;
			}
		}

		return result;
	}

	/**
	 * 添加侦听
	 * @param callback
	 * @param thisObj
	 * @param priority
	 * @param params
	 */
	addListener(callback, thisObj?, priority = 0, ...params) {
		if (!callback) {
			return;
		}

		const {_subscribers} = this;

		const listener = this.findListener(callback);
		if (!listener) {
			_subscribers.push({
				callback,
				thisObj,
				priority,
				params,
			});
		}
	}

	/**
	 * 添加侦听配置
	 * @param config
	 */
	addListenerConfig(config: any) {
		const {entity, component: componentIndex, method: methodName} = config;
		if (entity && componentIndex >= 0 && methodName) {
			this._subscribers.push(config);
		}
	}

	/**
	 * 添加单次侦听
	 * @param callback
	 * @param thisObj
	 * @param priority
	 * @param params
	 */
	once(callback, thisObj?, priority = 0, ...params) {
		if (!callback) {
			return;
		}

		const {_subscribers} = this;

		const listener = this.findListener(callback);
		if (!listener) {
			_subscribers.push({
				callback,
				thisObj,
				priority,
				params,
				once: true,
			});
		}
	}

	/**
	 * 移除侦听
	 * @param callback
	 */
	removeListener(callback) {
		if (!callback) {
			return;
		}

		const {_subscribers} = this;

		if (typeof callback === 'object') {
			_subscribers.splice(_subscribers.indexOf(callback), 1);
		} else {
			const listener = this.findListener(callback);
			if (listener) {
				_subscribers.splice(listener.index, 1);
			}
		}
	}

	/**
	 * 是否已经侦听
	 * @param callback
	 */
	hasListener(callback) {
		return !!this.findListener(callback);
	}

	/**
	 * 调用派发
	 * @param paramsNew
	 */
	invoke(...paramsNew) {
		const {_subscribers} = this;

		//按优先级降序
		_subscribers.sort((a, b) => {
			return a.priority - b.priority;
		});

		for (const subscriber of _subscribers) {
			if (subscriber) {
				let callback, thisObj;
				const {params, once} = subscriber;
				const allParams = params.concat(paramsNew);

				if (subscriber.entity) {
					const {entity, component: componentIndex, method: methodName} = subscriber;
					const component = entity.getAllComponents()[componentIndex];
					if (component) {
						callback = component[methodName];
					}
					thisObj = entity;
				} else {
					callback = subscriber.callback;
					thisObj = subscriber.thisObj;
				}

				if (callback) {
					try {
						callback.apply(thisObj, allParams);
					} catch (e) {
						//console.log(e);
					}

					if (once) {
						if (subscriber.entity) {
							this.removeListener(subscriber);
						} else {
							this.removeListener(callback);
						}
					}
				}
			}
		}
	}
}
