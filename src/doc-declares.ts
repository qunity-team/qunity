import {IEntity} from "./IEntity";

interface DocOptions {
	type: 'scene' | 'prefab',
	name: string,
}

export interface IKV {
	kv(props: { [key: string]: any }): ThisType<IDoc>
}

export interface DocEntity extends IEntity {
	uuid: string
}

export interface DocNode {
	p(props: { [key: string]: any }): DocNode

	c(children: any[]): DocNode

	s(scripts: any[]): DocNode
}

interface IDoc extends IKV {

}

export declare function Doc(options?: DocOptions): IDoc
