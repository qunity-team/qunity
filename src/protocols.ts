/**
 * Created by rockyl on 2020-03-11.
 */

import {Application} from "./Application";
import {IEntity} from "./IEntity";

//todo script,dynamic
export enum Protocols {
	ASSET = 'asset://',
	ENTITY = 'entity://',
}

export const protocols = {
	[Protocols.ASSET]: asset,
	[Protocols.ENTITY]: entity,
};

function asset(app: Application, key: string, value: any): any {
	let trulyValue;

	const uuid = value.replace(Protocols.ASSET, '');
	trulyValue = app.getAsset(uuid);

	return trulyValue;
}

function entity(app: Application, key: string, value: any, pid?: number): IEntity {
	let trulyValue;

	if(value){
		const uuid = transPrefabUUID(value.replace(Protocols.ENTITY, ''), pid);
		trulyValue = app.entityMap[uuid];
	}else{
		trulyValue = null;
	}

	return trulyValue;
}

function transPrefabUUID(uuid, pid: number) {
	return pid ? pid + '_' + uuid : uuid;
}
