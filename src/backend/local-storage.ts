/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StashyBackend, StashyBackendInitOptions } from './_base';

/**
 * Basic localStorage-based storage. Great for web browsers!
 */
export default class LocalStorageBackend implements StashyBackend {
	private _id: string;

	public _init(options: StashyBackendInitOptions) {
		this._id = options.id || '';
	}

	private _key(key: string): string {
		return this._id ? this._id + '_' + key : key;
	}

	public clearAll() {
		localStorage.clear();
	}

	public delete(key: string) {
		localStorage.removeItem(this._key(key));
	}

	public getBoolean(key: string): boolean {
		const value = this.getString(key);
		return value ? value === 'true' : null;
	};

	public getNumber(key: string): number {
		const value = this.getString(key);
		return value ? parseFloat(value) : null;
	};

	public getString(key: string): string {
		return localStorage.getItem(this._key(key));
	};

	public set(key: string, value: boolean | number | string) {
		localStorage.setItem(this._key(key), typeof value === 'string' ? value : String(value));
	}
}
