/**
 * Created by rockyl on 2018/11/6.
 *
 */

import {HashObject} from "./HashObject";
import {dirtyFieldTrigger} from "./decorators";
import {vector2} from "./ReType";

/**
 * 2D矢量
 */
export class Vector2 extends HashObject implements vector2{
	/**
	 * x分量
	 */
	@dirtyFieldTrigger
	x: number;
	/**
	 * y分量
	 */
	@dirtyFieldTrigger
	y: number;

	onChange: Function;

	/**
	 * 创建一个2D矢量
	 * @param x x分量
	 * @param y y分量
	 * @param onChange 当改变时触发
	 */
	constructor(x: number = 0, y: number = 0, onChange?: Function) {
		super();

		this.onChange = onChange;

		this.setXY(x, y);
	}

	$onModify(value, key, oldValue) {
		this.onChange && this.onChange(value, key, oldValue);
	}

	/**
	 * 设置分量
	 * @param x
	 * @param y
	 */
	setXY(x: number = 0, y: number = 0): Vector2 {
		this.x = x;
		this.y = y;

		return this;
	}

	/**
	 * 从一个向量拷贝分量
	 * @param v2
	 */
	copyFrom(v2): Vector2 {
		this.x = v2.x;
		this.y = v2.y;
		return this;
	}

	/**
	 * 克隆出一个向量
	 */
	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	/**
	 * 把向量置空
	 */
	zero(): Vector2 {
		this.x = 0;
		this.y = 0;

		return this;
	}

	/**
	 * 是不是一个0向量
	 */
	get isZero(): boolean {
		return this.x == 0 && this.y == 0;
	}

	/**
	 * 单位化向量
	 */
	normalize(): Vector2 {
		let len = this.length;
		if (len == 0) {
			this.x = 1;
			return this;
		}
		this.x /= len;
		this.y /= len;
		return this;
	}

	/**
	 * 是不是一个单位向量
	 */
	get isNormalized(): boolean {
		return this.length == 1.0;
	}

	/**
	 * 截取向量长度
	 * @param max
	 */
	truncate(max): Vector2 {
		this.length = Math.min(max, this.length);
		return this;
	}

	/**
	 * 向量反向
	 */
	reverse(): Vector2 {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	/**
	 * 获取点乘
	 * @param v2
	 */
	dotProd(v2): number {
		return this.x * v2.x + this.y * v2.y;
	}

	/**
	 * 获取叉乘
	 * @param v2
	 */
	crossProd(v2): number {
		return this.x * v2.y - this.y * v2.x;
	}

	/**
	 * 获取长度的平方
	 * @param v2
	 */
	distSQ(v2): number {
		let dx = v2.x - this.x;
		let dy = v2.y - this.y;
		return dx * dx + dy * dy;
	}

	/**
	 * 获取两个向量的距离
	 * @param v2
	 */
	distance(v2): number {
		return Math.sqrt(this.distSQ(v2));
	}

	/**
	 * 向量加法
	 * @param v2
	 */
	add(v2): Vector2 {
		this.x += v2.x;
		this.y += v2.y;
		return this;
	}

	/**
	 * 向量减法
	 * @param v2
	 */
	subtract(v2): Vector2 {
		this.x -= v2.x;
		this.y -= v2.y;
		return this;
	}

	/**
	 * 向量乘于某个数
	 * @param value
	 */
	multiply(value: number): Vector2 {
		this.x *= value;
		this.y *= value;
		return this;
	}

	/**
	 * 向量除于某个数
	 * @param value
	 */
	divide(value: number): Vector2 {
		this.x /= value;
		this.y /= value;
		return this;
	}

	/**
	 * 向量角度
	 * @param value
	 */
	set angle(value: number) {
		this.radian = value * Math.PI / 180;
	}

	get angle(): number {
		return this.radian * 180 / Math.PI;
	}

	/**
	 * 向量弧度
	 * @param value
	 */
	set radian(value: number) {
		let len = this.length;
		this.setXY(Math.cos(value) * len, Math.sin(value) * len);
	}

	get radian(): number {
		return Math.atan2(this.y, this.x);
	}

	/**
	 * 是否等于某个向量
	 * @param v2
	 */
	equals(v2): boolean {
		return this.x == v2.x && this.y == v2.y;
	}

	/**
	 * 向量长度
	 * @param value
	 */
	get length(): number {
		return Math.sqrt(this.lengthSQ);
	}

	set length(value: number) {
		let a = this.radian;
		this.setXY(Math.cos(a) * value, Math.sin(a) * value);
	}

	/**
	 * 获取向量长度的平方
	 */
	get lengthSQ(): number {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * 获取向量斜率
	 */
	get slope(): number {
		return this.y / this.x;
	}

	toString(): string {
		return "[Vector2 (x:" + this.x + ", y:" + this.y + ")]";
	}

	toObj() {
		return {x: this.x, y: this.y}
	}

	toArray() {
		return [this.x, this.y];
	}

	static corner(v1, v2) {
		return Math.acos(v1.dotProd(v2) / (v1.length * v2.length));
	}
}
