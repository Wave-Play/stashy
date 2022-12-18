/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StashyBackend, StashyBackendInitOptions } from './_base'

/**
 * Basic localStorage-based storage. Great for web browsers!
 */
export class LocalStorageBackend implements StashyBackend {
	private _id: string

	public _init(options: StashyBackendInitOptions) {
		this._id = options.id || ''
	}

	private _key(key: string): string {
		return this._id ? this._id + '_' + key : key
	}

	public clearAll() {
		localStorage.clear()
	}

	public async clearAllAsync(): Promise<void> {
		this.clearAll()
	}

	public delete(key: string) {
		localStorage.removeItem(this._key(key))
	}

	public async deleteAsync(key: string): Promise<void> {
		this.delete(key)
	}

	public getBoolean(key: string): boolean {
		const value = this.getString(key)
		return value ? value === 'true' : null
	}

	public async getBooleanAsync(key: string): Promise<boolean> {
		const value = this.getString(key)
		return value ? value === 'true' : null
	}

	public getNumber(key: string): number {
		const value = this.getString(key)
		return value ? parseFloat(value) : null
	}

	public async getNumberAsync(key: string): Promise<number> {
		const value = this.getString(key)
		return value ? parseFloat(value) : null
	}

	public getString(key: string): string {
		return localStorage.getItem(this._key(key))
	}

	public async getStringAsync(key: string): Promise<string> {
		return localStorage.getItem(this._key(key))
	}

	public set(key: string, value: boolean | number | string) {
		localStorage.setItem(this._key(key), typeof value === 'string' ? value : String(value))
	}

	public async setAsync(key: string, value: boolean | number | string): Promise<void> {
		this.set(key, value)
	}
}
export default LocalStorageBackend
