/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StashyBackend, StashyOptions } from './backend/_base';
import CookieBackend from './backend/cookie';
import LocalStorageBackend from './backend/local-storage';
import pino from 'pino';
import { Platform } from 'react-native';
import AsyncStorageBackend from './backend/async-storage';

interface StashyConstructor {
	backend?: StashyBackend | {
		native?: StashyBackend
		ssr?: StashyBackend
		web?: StashyBackend
	}
	id: string
	logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error'
}

export class Stashy {
	// Instance ID
	private _id?: string;

	// Possible backend variants to use for actual storage
	// Ideally, only one of these should be active per instance, assuming that a given process doesn't need all
	private _backendNative: StashyBackend;
	private _backendSsr: StashyBackend;
	private _backendWeb: StashyBackend;

	// Our handy little pino logger helps us track down storage and backend compatibility bugs
	private _pino;

	constructor(options?: StashyConstructor) {
		const {
			backend,
			id,
			logLevel = 'error'
		} = options || {};

		// IDs are often used to separate out data storage into different entry groups
		this._id = id;

		// Set logger to preference level
		this._pino = pino({ level: logLevel });

		// Prepare our backing storage backend(s)
		// Defaults only get assigned if currently running in that platform
		this._backendNative = backend?.['native'] || (backend?.['_init'] ? backend : getDefaultBackend('native'));
		this._backendSsr = backend?.['ssr'] || (backend?.['_init'] ? backend : getDefaultBackend('ssr'));
		this._backendWeb = backend?.['web'] || (backend?.['_init'] ? backend : getDefaultBackend('web'));
		this._backend()._init({ id });
	}

	private _backend(): StashyBackend {
		if (isNative()) {
			this._pino.debug(`[${this._getId()}] using native backend...`);
			return this._backendNative;
		} else if (isSSR()) {
			this._pino.debug(`[${this._getId()}] using server side backend...`);
			return this._backendSsr;
		} else {
			this._pino.debug(`[${this._getId()}] using web client backend...`);
			return this._backendWeb;
		}
	}

	private _getId(): string {
		return `stashy${this._id ? '-' + this._id : ''}`;
	}

	public clearAll(options?: StashyOptions) {
		this._pino.trace(`[${this._getId()}] clearAll() with options:`, options);
		this._backend().clearAll(options);
	}

	public delete(key: string, options?: StashyOptions) {
		this._pino.trace(`[${this._getId()}] delete(${key}) with options:`, options);
		this._backend().delete(key, options);
	}

	public get<T>(key: string, options?: StashyOptions): T {
		this._pino.trace(`[${this._getId()}] get(${key}) with options:`, options);
		const encodedValue = this._backend().getString(key, options);
		const value = encodedValue ? JSON.parse(encodedValue) : null;
		this._pino.debug(`[${this._getId()}] get(${key}) value is:`, value);
		return value;
	};

	public async getAsync<T>(key: string, options?: StashyOptions): Promise<T> {
		this._pino.trace(`[${this._getId()}] getAsync(${key}) with options:`, options);
		const encodedValue = await this._backend().getStringAsync(key, options);
		const value = encodedValue ? JSON.parse(encodedValue) : null;
		this._pino.debug(`[${this._getId()}] getAsync(${key}) value is:`, value);
		return value;
	};

	public getBoolean(key: string, options?: StashyOptions): boolean {
		this._pino.trace(`[${this._getId()}] getBoolean(${key}) with options:`, options);
		const value = this._backend().getBoolean(key, options);
		this._pino.debug(`[${this._getId()}] getBoolean(${key}) value is:`, value);
		return value;
	};

	public async getBooleanAsync(key: string, options?: StashyOptions): Promise<boolean> {
		this._pino.trace(`[${this._getId()}] getBooleanAsync(${key}) with options:`, options);
		const value = await this._backend().getBooleanAsync(key, options);
		this._pino.debug(`[${this._getId()}] getBooleanAsync(${key}) value is:`, value);
		return value;
	};

	public getNumber(key: string, options?: StashyOptions): number {
		this._pino.trace(`[${this._getId()}] getNumber(${key}) with options:`, options);
		const value = this._backend().getNumber(key, options);
		this._pino.debug(`[${this._getId()}] getNumber(${key}) value is:`, value);
		return value;
	};

	public async getNumberAsync(key: string, options?: StashyOptions): Promise<number> {
		this._pino.trace(`[${this._getId()}] getNumberAsync(${key}) with options:`, options);
		const value = await this._backend().getNumberAsync(key, options);
		this._pino.debug(`[${this._getId()}] getNumberAsync(${key}) value is:`, value);
		return value;
	};

	public getString(key: string, options?: StashyOptions): string {
		this._pino.trace(`[${this._getId()}] getString(${key}) with options:`, options);
		const value = this._backend().getString(key, options);
		this._pino.debug(`[${this._getId()}] getString(${key}) value is:`, value);
		return value;
	};

	public async getStringAsync(key: string, options?: StashyOptions): Promise<string> {
		this._pino.trace(`[${this._getId()}] getStringAsync(${key}) with options:`, options);
		const value = await this._backend().getStringAsync(key, options);
		this._pino.debug(`[${this._getId()}] getStringAsync(${key}) value is:`, value);
		return value;
	};

	public set(key: string, value: boolean | number | string | any, options?: StashyOptions) {
		this._pino.trace(`[${this._getId()}] set(${key}) with options:`, options);
		const isObject = typeof value === 'object';
		const encodedValue = isObject ? JSON.stringify(value) : value;
		this._backend().set(key, encodedValue, options);
		this._pino.info(`[${this._getId()}] set(${key}) <<`, value);
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
	return !isNative() && typeof window !== 'object';
}
