/**
 * Created by rockyl on 2020-03-10.
 */

import {IEntity} from "./IEntity";
import {Application} from "./Application";
import {Protocols, protocols} from "./protocols";
import {QunityEvent} from "./QunityEvent";

let prefabID: number = 0;

const specialProps = ['enabled', 'active', 'script',];

export interface IDoc {
	name: string,
	type: 'scene' | 'prefab',
	factory: Function,
	assets: any[],
}

/**
 * 实例化节点树
 * @param app
 * @param doc
 */
export function instantiate(app: Application, doc: IDoc) {
	if (doc) {
		let view = doc.factory();
		let pid;
		if (doc.type === 'prefab') {
			pid = ++prefabID;
		}
		setupComponent(app, view, pid);
		enableComponent(app, view, pid);

		return view;
	}
}

/**
 * 装配实体树
 * @param app
 * @param config
 * @param pid
 */
function setupEntityTree(app: Application, config, pid?: number) {
	let entity: IEntity = null;
	if (config) {
		let {$type = 'Node', name, uuid, children, active} = config;
		if ($type === 'prefab') {
			let {link} = config;
			let prefabConfig = app.getAsset(link.replace('asset://', ''));
			//todo make callback
			//entity = instantiate(app, prefabConfig);
		} else {
			entity = app.createEntity($type);
		}
		if (pid !== undefined && uuid !== undefined) {
			uuid = pid + '_' + uuid;
		}
		if (name) {
			entity['name'] = name;
		}
		entity['uuid'] = uuid;

		if (active !== false) {
			entity.setActive(true);
		}

		injectProps(app, entity, config);

		if (uuid !== undefined) {
			app.entityMap[uuid] = entity;
		}

		if (children) {
			for (let child of children) {
				const childEntity = setupEntityTree(app, child, pid);
				app.addDisplayNode(childEntity, entity);
			}
		}
	}

	return entity;
}

/**
 * 装配组件
 * @param app
 * @param entity
 * @param pid
 */
function setupComponent(app: Application, entity, pid?: number) {
	if (!entity.children) {
		return;
	}
	for (let i = 0, li = entity.children.length; i < li; i++) {
		const child: IEntity = entity.children[i];
		let comps = child['$componentConfigs'];
		if (comps) {
			let compManager = child.entityAdaptor.components;
			for (let comp of comps) {
				let component = compManager.addComponent(comp.script, false);
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
function enableComponent(app: Application, entity, pid?: number) {
	for (let i = 0, li = entity.children.length; i < li; i++) {
		const child: IEntity = entity.children[i];

		let compManager = child.entityAdaptor.components;
		compManager.setActive(true);

		enableComponent(app, child, pid);
	}
}

/**
 * 注入属性
 * @param app
 * @param target
 * @param props
 * @param pid
 */
function injectProps(app: Application, target: any, props: any, pid?: number) {
	if (props && target) {
		for (let field in props) {
			if (specialProps.indexOf(field) >= 0) {
				continue;
			}

			let value = props[field];
			if (typeof value === 'object') {//复杂数据
				transComplexProps(app, target, field, value);
			} else {
				transBaseProps(app, target, field, value, pid);
			}
		}
	}
}

function injectEvent(app: Application, listeners, pid?) {
	let event = new QunityEvent();
	for (const listener of listeners) {
		listener.entity = protocols[Protocols.ENTITY](app, '', listener.entity, pid);
		event.addListenerConfig(listener)
	}
	return event;
}

function transComplexProps(app: Application, target: any, field: string, value: any, pid?: number) {
	let trulyValue = value;
	let override = false;
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
function transBaseProps(app: Application, target: any, field: string, value: any, pid?: number) {
	let trulyValue = value;
	if (typeof value === 'string') {
		let hit;
		let protocolGroups = [protocols, app.adaptorOptions.protocols];
		for (let protocols of protocolGroups) {
			for (let protocol in protocols) {
				if (value.indexOf(protocol) === 0) {
					let protocolFunc = protocols[protocol];
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
export function parseViewDoc(app: Application, docSource): IDoc {
	function p(props) {
		injectProps(app, this, props);

		if (props.active !== false && this.setActive) {
			this.setActive(true);
		}

		return this;
	}

	function kv(props) {
		for (let key in props) {
			this[key] = props[key];
		}
		return this;
	}

	function c(children) {
		for (let child of children) {
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

	const pixiNodes = {};
	const requireContext = {
		'qunity': {
			Doc: function (props) {
				let obj = {
					kv,
					p,
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

	const entityNames = Object.keys(app.entityDefs);
	for (let entityName of entityNames) {
		pixiNodes[entityName] = function (props) {
			let entity = app.createEntity(entityName);
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
		}
	}
	let func = new Function('require', 'exports', docSource);
	let exports: any = {};
	func(requireMethod, exports);
	return exports.doc;
}
