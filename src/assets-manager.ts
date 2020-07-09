/**
 * Created by rockyl on 2020-03-20.
 */
import {Application} from "./Application";

export class AssetsManager {
	private _app: Application;
	private _assetCache = {};

	constructor(app: Application) {
		this._app = app;
	}

	addAsset(asset, opt) {
		this._assetCache[opt.uuid || opt.name || opt.url] = asset;
	}

	getAsset(uuid: string) {
		return this._assetCache[uuid];
	}

	clean() {
		this._assetCache = {};
	}
}
