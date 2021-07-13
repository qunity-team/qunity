interface DocOptions {
	type: 'scene' | 'prefab',
	name: string,
}

interface IKV {
	kv(props: { [key: string]: any }): ThisType<IDoc>
}

interface IDoc extends IKV {

}

export declare function Doc(options?: DocOptions): IDoc
