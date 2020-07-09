/**
 * Created by rockyl on 2020-05-15.
 */

import 'whatwg-fetch'
import {objectStringify} from "./utils";

/**
 * 调用接口
 * @param uri
 * @param params
 * @param contentType
 * @param responseType
 * @param credentials
 */
export function callApi(uri, {host = '', params = null, method = 'get', credentials = 'include', contentType = 'json',} = {}) {
	let url = host + (uri.startsWith('http') || uri.startsWith('//') ? uri : uri);

	const options: any = {
		method,
		headers: {},
		credentials,
	};
	if (params) {
		if (method.toLowerCase() === 'post') {
			switch (contentType) {
				case 'form-data':
					let formData = new FormData();
					for (let key in params) {
						let value = params[key];
						if (value instanceof File) {
							formData.append(key, value, value.name);
						} else {
							formData.append(key, value);
						}
					}
					options.body = formData;
					break;
				case 'form':
					options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
					options.body = objectStringify(params);
					break;
				case 'json':
					options.headers['Content-Type'] = 'application/json';
					options.body = JSON.stringify(params);
					break;
			}
		} else {
			url += (url.indexOf('?') < 0 ? '?' : '');
			url += (url.endsWith('?') ? '' : '&') + objectStringify(params);
		}
	}

	return fetch(url, options)
		.then(
			response => {
				return response.text();
			}
		)
		.then(
			respText => {
				try {
					let jsonObj = JSON.parse(respText);
					if (jsonObj.code === 0) {
						return jsonObj.data;
					}

					return Promise.reject(new Error('call api failed'));
				} catch (e) {
					return Promise.reject(e);
				}
			}
		);
}
