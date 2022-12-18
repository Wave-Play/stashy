/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StashyBackend, StashyBackendInitOptions } from './_base'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Basic AsyncStorage implementation.
 * Good start for native platforms, but we recommend using MMKV instead for better performance.
 */
export default class AsyncStorageBackend implements StashyBackend {
	private _id: string

	public _init(options: StashyBackendInitOptions) {
		this._id = options.id || ''
	}

	private _key(key: string): string {
		return this._id ? this._id + '_' + key : key
	}

	public clearAll() {
		AsyncStorage.clear()
	}

	public async clearAllAsync(): Promise<void> {
		return AsyncStorage.clear()
	}

	public delete(key: string) {
		AsyncStorage.removeItem(this._key(key))
	}

	public async deleteAsync(key: string): Promise<void> {
		return AsyncStorage.removeItem(this._key(key))
	}

	public getBoolean(key: string): boolean {
		const value = this.getString(key)
		return value ? value === 'true' : null
	}

	public async getBooleanAsync(key: string): Promise<boolean> {
		const value = await this.getStringAsync(key)
		return value ? value === 'true' : null
	}

	public getNumber(key: string): number {
		const value = this.getString(key)
		return value ? parseFloat(value) : null
	}

	public async getNumberAsync(key: string): Promise<number> {
		const value = await this.getStringAsync(key)
		return value ? parseFloat(value) : null
	}

	public getString(key: string): string {
		// @ts-expect-error
		return AsyncStorage.getItem(this._key(key))
	}

	public async getStringAsync(key: string): Promise<string> {
		return AsyncStorage.getItem(this._key(key))
	}

	public set(key: string, value: boolean | number | string) {
		AsyncStorage.setItem(this._key(key), typeof value === 'string' ? value : String(value))
	}

	public async setAsync(key: string, value: boolean | number | string): Promise<void> {
		return AsyncStorage.setItem(this._key(key), typeof value === 'string' ? value : String(value))
	}
}
