/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StashyBackend, StashyBackendInitOptions, StashyOptions } from './_base';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

/**
 * Cookie-based storage. Perfect for Node SSR!
 * 
 * Important note:
 * Due to the nature of cookies, it is required that you pass `context` as an option with every call.
 * This is because cookies are stored per-request, and not per-process.
 */
export default class CookieBackend implements StashyBackend {
	private _id: string;

	public _init(options: StashyBackendInitOptions) {
		this._id = options.id || '';
	}

	private _key(key: string): string {
		return this._id ? this._id + '_' + key : key;
	}

	public clearAll() {
		throw new Error(`clearAll() is not supported for CookieBackend`);
	}

	public async clearAllAsync(): Promise<void> {
		throw new Error(`clearAllAsync() is not supported for CookieBackend`);
	}

	public delete(key: string, options?: StashyOptions) {
		validateOptions(options);
		destroyCookie(options?.context, this._key(key));
	}

	public async deleteAsync(key: string, options?: StashyOptions): Promise<void> {
		this.delete(key, options);
	}

	public getBoolean(key: string, options?: StashyOptions): boolean {
		const value = this.getString(key, options);
		return value ? value === 'true' : null;
	};

	public async getBooleanAsync(key: string, options?: StashyOptions): Promise<boolean> {
		const value = this.getString(key, options);
		return value ? value === 'true' : null;
	};

	public getNumber(key: string, options?: StashyOptions): number {
		const value = this.getString(key, options);
		return value ? parseFloat(value) : null;
	};

	public async getNumberAsync(key: string, options?: StashyOptions): Promise<number> {
		const value = this.getString(key, options);
		return value ? parseFloat(value) : null;
	};

	public getString(key: string, options?: StashyOptions): string {
		validateOptions(options);
		return parseCookies(options?.context)?.[this._key(key)];
	};

	public async getStringAsync(key: string, options?: StashyOptions): Promise<string> {
		validateOptions(options);
		return parseCookies(options?.context)?.[this._key(key)];
	};

	public set(key: string, value: boolean | number | string, options?: StashyOptions) {
		validateOptions(options);
		const encodedValue = typeof value === 'string' ? value : String(value);
		setCookie(options?.context, this._key(key), encodedValue, {
			domain: options?.domain,
			maxAge: options?.maxAge,
			path: options?.path || '/',
			secure: options?.secure
		});
	}

	public async setAsync(key: string, value: boolean | number | string, options?: StashyOptions): Promise<void> {
		this.set(key, value, options);
	}
}

const validateOptions = (options?: StashyOptions) => {
	if (!options?.silent && !options?.context) {
		throw new Error(`You must provide context in your options for this!`);
	}
};
