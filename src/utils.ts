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
export function lerp(begin: number, end: number, t: number, allowOutOfBounds = false) {
	if (!allowOutOfBounds) {
		t = Math.max(0, Math.min(1, t));
	}

	let sign = end - begin;
	sign = sign > 0 ? 1 : (sign < 0 ? -1 : 0);
	const distance = Math.abs(end - begin);

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
export function lerpVector2(begin: {x: number, y: number}, end: {x: number, y: number}, t: number, allowOutOfBounds = false) {
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
export function lerpVector3(begin: {x: number, y: number, z: number}, end: {x: number, y: number,  z: number}, t: number, allowOutOfBounds = false) {
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
export function decodeJson5(str){
	let func = new Function('return ' + str);
	try {
		return func();
	}catch (e) {
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
export function injectProp(target: any, data?: any, callback?: Function, ignoreMethod: boolean = true, ignoreNull: boolean = true): boolean {
	if (!target || !data) {
		return false;
	}

	let result = false;
	for (let key in data) {
		let value: any = data[key];
		if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)) {
			if (callback) {
				callback(target, key, value);
			} else {
				try {
					target[key] = value;
				} catch (e) {

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
export function copyProp(target, data?, schema?) {
	if (schema) {
		for (let key in schema) {
			let valueConfig = schema[key];
			if (Array.isArray(valueConfig)) {
				target[key] = {};
				for (let field of valueConfig) {
					target[key][field] = data[key][field];
				}
			} else if (typeof valueConfig === 'string') {
				target[valueConfig] = data[valueConfig];
			} else if (typeof valueConfig === 'object') {
				target[key] = {};
				copyProp(target[key], data[key], valueConfig)
			}
		}
	}
}

/**
 * 对象转搜索字符串
 * @param obj
 */
export function objectStringify(obj) {
	if (!obj) {
		return '';
	}
	let arr = [];
	for (let key in obj) {
		arr.push(key + '=' + obj[key]);
	}
	return arr.join('&');
}
