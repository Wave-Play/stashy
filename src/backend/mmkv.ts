/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
// @ts-expect-error (peer dependency)
import { MMKV } from 'react-native-mmkv';
import { StashyBackend, StashyBackendInitOptions } from './_base';

interface MmkvBackendOptions {
	mmkv?: MMKV
}

/**
 * Storage based on the MMKV library.
 * This is roughly 30x faster than AsyncStorage!
 * Perfect for native platforms.
 * 
 * https://github.com/mrousavy/react-native-mmkv
 */
export default class MmkvBackend implements StashyBackend {
	private _initOptions?: MmkvBackendOptions;
	private _storage: MMKV;

	constructor(options?: MmkvBackendOptions) {
		this._initOptions = options;
	}

	public _init(options: StashyBackendInitOptions) {
		this._storage = this._initOptions?.mmkv || new MMKV({ id: options.id || 'storage' });
	}

	public clearAll() {
		this._storage?.clearAll();
	}

	public async clearAllAsync(): Promise<void> {
		this.clearAll();
	}

	public delete(key: string) {
		this._storage.delete(key);
	}

	public async deleteAsync(key: string): Promise<void> {
		this.delete(key);
	}

	public getBoolean(key: string): boolean {
		return this._storage.getBoolean(key);
	};

	public async getBooleanAsync(key: string): Promise<boolean> {
		return this._storage.getBoolean(key);
	};

	public getNumber(key: string): number {
		return this._storage.getNumber(key);
	};

	public async getNumberAsync(key: string): Promise<number> {
		return this._storage.getNumber(key);
	};

	public getString(key: string): string {
		return this._storage.getString(key);
	};

	public async getStringAsync(key: string): Promise<string> {
		return this._storage.getString(key);
	};

	public set(key: string, value: boolean | number | string) {
		this._storage.set(key, value);
	}

	public async setAsync(key: string, value: boolean | number | string): Promise<void> {
		this.set(key, value);
	}
}
