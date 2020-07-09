/**
 * Created by rockyl on 2018/11/9.
 *
 * 属性装饰器
 */

/**
 * 属性修改时触发
 * @param onModify
 */
export function fieldChanged(onModify) {
	return function (target: any, key: string) {
		const privateKey = '_' + key;
		Object.defineProperty(target, key, {
			enumerable: true,
			get: function () {
				return this[privateKey];
			},
			set: function (v) {
				const oldValue = this[privateKey];
				if (oldValue !== v) {
					this[privateKey] = v;
					onModify.apply(this, [v, key, oldValue]);
				}
			}
		})
	}
}

/**
 * 属性变脏时设置宿主的dirty属性为true
 */
export const dirtyFieldDetector = fieldChanged(
	function (value, key, oldValue) {
		this['__fieldDirty'] = true;
	}
);

/**
 * 深度属性变脏时设置宿主的dirty属性为true
 */
export const deepDirtyFieldDetector = fieldChanged(
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

/**
 * 属性变脏时触发onModify方法
 */
export const dirtyFieldTrigger = fieldChanged(
	function (value, key, oldValue) {
		this['$onModify'] && this['$onModify'](value, key, oldValue);
	}
);

/**
 * 深入属性变脏时触发onModify方法
 */
export const deepDirtyFieldTrigger = fieldChanged(
	function (value: any, key, oldValue) {
		let onModify = this['$onModify'];
		const scope = this;
		if (onModify) {
			onModify.call(scope, value, key, oldValue);

			if (typeof value === 'object') {
				if (value.hasOwnProperty('onChange')) {
					value['onChange'] = onChange;
				} else {
					mutateObject(value, onChange);
				}
			}
		}

		function onChange(_value, _key, _oldValue) {
			onModify.call(scope, value, key, oldValue, _key);
		}
	}
);

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

function mutateProp(data: any, key: string, value: any, onChange: Function): void {
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: false,
		get: () => {
			return value;
		},
		set: v => {
			let oldValue = value;
			if (v == value) return;
			value = v;
			onChange(value, key, oldValue);
		}
	});
}
