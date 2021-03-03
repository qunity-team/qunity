/**
 * Created by rockyl on 2018/11/9.
 *
 * 属性装饰器
 */

function mutateObject(data, onChange) {
	if (!data['__mutated__']) {
		for (var key in data) {
			mutateProp(data, key, onChange);
		}
		Object.defineProperty(data, "__mutated__", {
			value: true,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
}

function mutateProp(data: any, key: string, onChange: Function): void {
	const privateKey = '__' + key;
	const initValue = data[key];
	let setted = false;
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: false,
		get: function () {
			return setted ? this[privateKey] : initValue;
		},
		set: function (v) {
			if (v == this[privateKey]) return;
			setted = true;
			let oldValue = this[privateKey];
			this[privateKey] = v;
			onChange.apply(this, [v, key, oldValue]);
		}
	});
}

/**
 * 属性修改时触发
 * @param onModify
 */
export function watchField(onModify) {
	return function (target: any, key: string) {
		mutateProp(target, key, onModify);
	}
}

/**
 * 属性可观察
 */
export const watchable = watchField(
	function (value, key, oldValue) {
		this['__fieldDirty'] = true;
		this['$onModify'].apply(this, [value, key, oldValue]);
	}
);

/**
 * 属性可深度观察
 */
export const deepWatchable = watchField(
	function (value, key, oldValue) {
		const scope = this;
		scope['__fieldDirty'] = true;
		if (typeof value === 'object') {
			if (value.hasOwnProperty('onChange')) {
				value['onChange'] = this['$onModify'];
			} else {
				mutateObject(value, onChange);
			}
		}

		function onChange() {
			scope['__fieldDirty'] = true;
		}
	}
);
