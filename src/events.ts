/**
 * Created by rockyl on 2021/2/15.
 */

interface Options {
	prefix?: string;
}

/**
 * 安装事件功能
 * @param target
 * @param options
 */
export function setupEvents(target, options: Options = {}) {
	const {prefix} = options;

	const events = target.$events = {};
	target[prefix + 'on'] = function (event, callback) {
		let e = events[event];
		if (!e) {
			e = events[event] = [];
		}
		e.push(callback);
	}
	target[prefix + 'off'] = function (event, callback) {
		let e = events[event];
		if (e) {
			let i = e.indexOf(callback);
			e.splice(i, 1);
		}
	}
	target[prefix + 'emit'] = function (event, ...args) {
		let e = events[event];
		if (e) {
			for (let cb of e) {
				cb.apply(target, args);
			}
		}
	}
}
