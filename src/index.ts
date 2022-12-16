/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StashyBackend, StashyOptions } from './backend/_base';
import CookieBackend from './backend/cookie';
import LocalStorageBackend from './backend/local-storage';
import { Platform } from 'react-native';
import AsyncStorageBackend from './backend/async-storage';

export interface Logger {
	debug: (...args: any[]) => void
	error: (...args: any[]) => void
	info: (...args: any[]) => void
	warn: (...args: any[]) => void
	trace: (...args: any[]) => void
}

interface StashyConstructor {
	backend?: StashyBackend | {
		native?: StashyBackend
		ssr?: StashyBackend
		web?: StashyBackend
	}
	id: string
	logger?: Logger
}

export class Stashy {
	// Instance ID
	private _id?: string;

	// Possible backend variants to use for actual storage
	// Ideally, only one of these should be active per instance, assuming that a given process doesn't need all
	private _backendNative: StashyBackend;
	private _backendSsr: StashyBackend;
	private _backendWeb: StashyBackend;

	// Our handy little logger helps us track down storage and backend compatibility bugs
	private _logger: Logger;

	constructor(options?: StashyConstructor) {
		const {
			backend,
			id,
			logger
		} = options || {};

		// IDs are often used to separate out data storage into different entry groups
		this._id = id;

		// Set logger to preference level
		this._logger = logger;

		// Prepare our backing storage backend(s)
		// Defaults only get assigned if currently running in that platform
		this._backendNative = backend?.['native'] || (backend?.['_init'] ? backend : getDefaultBackend('native'));
		this._backendSsr = backend?.['ssr'] || (backend?.['_init'] ? backend : getDefaultBackend('ssr'));
		this._backendWeb = backend?.['web'] || (backend?.['_init'] ? backend : getDefaultBackend('web'));
		this._backend()._init({ id });
	}

	private _backend(options?: StashyOptions): StashyBackend {
		if (options?.backend === 'native') {
			this._log('debug', `forced native backend!`);
			return this._backendNative;
		} else if (options?.backend === 'ssr') {
			this._log('debug', `forced server side backend!`);
			return this._backendSsr;
		} else if (options?.backend === 'web') {
			this._log('debug', `forced web client backend!`);
			return this._backendWeb;
		}

		if (isNative()) {
			this._log('debug', `using native backend...`);
			return this._backendNative;
		} else if (isSSR()) {
			this._log('debug', `using server side backend...`);
			return this._backendSsr;
		} else {
			this._log('debug', `using web client backend...`);
			return this._backendWeb;
		}
	}

	private _log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', message?: string, ...args: any[]) {
		const id = `stashy${this._id ? '-' + this._id : ''}`
		this._logger?.[level]?.(`[${id}] ` + message, ...args)
	}

	public clearAll(options?: StashyOptions) {
		this._log('trace', `clearAll() with options:`, options);
		this._backend(options).clearAll(options);
	}

	public delete(key: string, options?: StashyOptions) {
		this._log('trace', `delete(${key}) with options:`, options);
		this._backend(options).delete(key, options);
	}

	public get<T>(key: string, options?: StashyOptions): T {
		this._log('trace', `get(${key}) with options:`, options);
		const encodedValue = this._backend(options).getString(key, options);
		const value = encodedValue ? JSON.parse(encodedValue) : null;
		this._log('debug', `get(${key}) value is:`, value);
		return value || options?.default;
	};

	public async getAsync<T>(key: string, options?: StashyOptions): Promise<T> {
		this._log('trace', `getAsync(${key}) with options:`, options);
		const encodedValue = await this._backend(options).getStringAsync(key, options);
		const value = encodedValue ? JSON.parse(encodedValue) : null;
		this._log('debug', `getAsync(${key}) value is:`, value);
		return value || options?.default;
	};

	public getBoolean(key: string, options?: StashyOptions): boolean {
		this._log('trace', `getBoolean(${key}) with options:`, options);
		const value = this._backend(options).getBoolean(key, options);
		this._log('debug', `getBoolean(${key}) value is:`, value);
		return value || options?.default;
	};

	public async getBooleanAsync(key: string, options?: StashyOptions): Promise<boolean> {
		this._log('trace', `getBooleanAsync(${key}) with options:`, options);
		const value = await this._backend(options).getBooleanAsync(key, options);
		this._log('debug', `getBooleanAsync(${key}) value is:`, value);
		return value || options?.default;
	};

	public getNumber(key: string, options?: StashyOptions): number {
		this._log('trace', `getNumber(${key}) with options:`, options);
		const value = this._backend(options).getNumber(key, options);
		this._log('debug', `getNumber(${key}) value is:`, value);
		return value || options?.default;
	};

	public async getNumberAsync(key: string, options?: StashyOptions): Promise<number> {
		this._log('trace', `getNumberAsync(${key}) with options:`, options);
		const value = await this._backend(options).getNumberAsync(key, options);
		this._log('debug', `getNumberAsync(${key}) value is:`, value);
		return value || options?.default;
	};

	public getString(key: string, options?: StashyOptions): string {
		this._log('trace', `getString(${key}) with options:`, options);
		const value = this._backend(options).getString(key, options);
		this._log('debug', `getString(${key}) value is:`, value);
		return value || options?.default;
	};

	public async getStringAsync(key: string, options?: StashyOptions): Promise<string> {
		this._log('trace', `getStringAsync(${key}) with options:`, options);
		const value = await this._backend(options).getStringAsync(key, options);
		this._log('debug', `getStringAsync(${key}) value is:`, value);
		return value || options?.default;
	};

	public set(key: string, value: boolean | number | string | any, options?: StashyOptions) {
		this._log('trace', `set(${key}) with options:`, options);
		const isObject = typeof value === 'object';
		const encodedValue = isObject ? JSON.stringify(value) : value;
		this._backend(options).set(key, encodedValue, options);
		this._log('info', `set(${key}) <<`, value);
	}
}
const stashy = new Stashy();
export default stashy;

function getDefaultBackend(platform: 'native' | 'ssr' | 'web'): StashyBackend {
	if (isNative() && platform === 'native') {
		return new AsyncStorageBackend();
	} else if (isSSR() && platform === 'ssr') {
		return new CookieBackend();
	} else if (!isNative() && !isSSR() && platform === 'web') {
		return new LocalStorageBackend();
	} else {
		return null;
	}
};

function isNative(): boolean {
	return Platform.OS === 'android' || Platform.OS === 'ios';
}

function isSSR(): boolean {
	return (!isNative()) && typeof window !== 'object';
}
