/**
 * Created by rockyl on 2018/11/5.
 */

let HASH_CODE_INK: number = 0;

function getHashCode() {
	return ++HASH_CODE_INK;
}

/**
 * 哈希对象
 */
export class HashObject {
	private _hashCode: number;

	constructor() {
		this._hashCode = getHashCode();
	}

	get hashCode(): number {
		return this._hashCode;
	}
}
