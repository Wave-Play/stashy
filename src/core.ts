/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { isNative, isSSR } from './utils'
import type { StashyBackend, StashyOptions } from './backend/_base'
import type { Logger } from './types'

interface StashyConstructor {
	backend?:
		| StashyBackend
		| {
				native?: StashyBackend
				ssr?: StashyBackend
				web?: StashyBackend
		  }
	id?: string
	logger?: Logger
}

export class Stashy {
	// Instance ID
	private _id?: string

	// Possible backend variants to use for actual storage
	// Ideally, only one of these should be active per instance, assuming that a given process doesn't need all
	private _backendNative: StashyBackend
	private _backendSsr: StashyBackend
	private _backendWeb: StashyBackend

	// Our handy little logger helps us track down storage and backend compatibility bugs
	private _logger: Logger

	constructor(options?: StashyConstructor) {
		const { backend, id, logger } = options ?? {}

		// IDs are often used to separate out data storage into different entry groups
		// It's also useful for distinguishing between multiple instances of Stashy in logs
		this._id = id

		// Set logger to preference level
		this._logger = logger

		// Prepare our backing storage backend(s)
		// Defaults only get assigned if currently running in that platform
		this._backendNative = backend?.['native'] ?? backend
		this._backendSsr = backend?.['ssr'] ?? backend
		this._backendWeb = backend?.['web'] ?? backend
		this._backend()._init({ id, logger, stashy: this })
	}

	protected _backend(options?: StashyOptions): StashyBackend {
		if (options?.backend === 'native') {
			this._log('info', `forced native backend!`)
			return this._backendNative
		} else if (options?.backend === 'ssr') {
			this._log('info', `forced server side backend!`)
			return this._backendSsr
		} else if (options?.backend === 'web') {
			this._log('info', `forced web client backend!`)
			return this._backendWeb
		}

		if (isNative()) {
			this._log('debug', `using native backend...`)
			return this._backendNative
		} else if (isSSR()) {
			this._log('debug', `using server side backend...`)
			return this._backendSsr
		} else {
			this._log('debug', `using web client backend...`)
			return this._backendWeb
		}
	}

	protected _log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', message?: string, ...args: any[]) {
		const id = `stashy${this._id ? '-' + this._id : ''}`
		this._logger?.[level]?.(`[${id}] ` + message, ...args)
	}

	public clearAll(options?: StashyOptions) {
		this._log('debug', `clearAll() with options:`, options)
		this._backend(options).clearAll(options)
	}

	public delete(key: string, options?: StashyOptions) {
		this._log('debug', `delete(${key}) with options:`, options)
		this._backend(options).delete(key, options)
	}

	public get<T>(key: string, options?: StashyOptions): T {
		this._log('debug', `get(${key}) with options:`, options)
		const encodedValue = this._backend(options).getString(key, options)
		let value = null
		if (typeof encodedValue === 'string') {
			value = encodedValue ? JSON.parse(encodedValue) : null
		} else if (encodedValue) {
			value = encodedValue
		}
		this._log('info', `get(${key}) value is:`, value)
		return value ?? options?.default
	}

	public async getAsync<T>(key: string, options?: StashyOptions): Promise<T> {
		this._log('debug', `getAsync(${key}) with options:`, options)
		const encodedValue = await this._backend(options).getStringAsync(key, options)
		const value = encodedValue ? JSON.parse(encodedValue) : null
		this._log('info', `getAsync(${key}) value is:`, value)
		return value ?? options?.default
	}

	public getBoolean(key: string, options?: StashyOptions): boolean {
		this._log('debug', `getBoolean(${key}) with options:`, options)
		const value = this._backend(options).getBoolean(key, options)
		this._log('info', `getBoolean(${key}) value is:`, value)
		return value ?? options?.default
	}

	public async getBooleanAsync(key: string, options?: StashyOptions): Promise<boolean> {
		this._log('debug', `getBooleanAsync(${key}) with options:`, options)
		const value = await this._backend(options).getBooleanAsync(key, options)
		this._log('info', `getBooleanAsync(${key}) value is:`, value)
		return value ?? options?.default
	}

	public getNumber(key: string, options?: StashyOptions): number {
		this._log('debug', `getNumber(${key}) with options:`, options)
		const value = this._backend(options).getNumber(key, options)
		this._log('info', `getNumber(${key}) value is:`, value)
		return value ?? options?.default
	}

	public async getNumberAsync(key: string, options?: StashyOptions): Promise<number> {
		this._log('debug', `getNumberAsync(${key}) with options:`, options)
		const value = await this._backend(options).getNumberAsync(key, options)
		this._log('info', `getNumberAsync(${key}) value is:`, value)
		return value ?? options?.default
	}

	public getString(key: string, options?: StashyOptions): string {
		this._log('debug', `getString(${key}) with options:`, options)
		const value = this._backend(options).getString(key, options)
		this._log('info', `getString(${key}) value is:`, value)
		return value ?? options?.default
	}

	public async getStringAsync(key: string, options?: StashyOptions): Promise<string> {
		this._log('debug', `getStringAsync(${key}) with options:`, options)
		const value = await this._backend(options).getStringAsync(key, options)
		this._log('info', `getStringAsync(${key}) value is:`, value)
		return value ?? options?.default
	}

	public set(key: string, value: boolean | number | string | any, options?: StashyOptions) {
		this._log('debug', `set(${key}) with options:`, options)
		const isObject = typeof value === 'object'
		const encodedValue = isObject ? JSON.stringify(value) : value
		this._backend(options).set(key, encodedValue, options)
		this._log('info', `set(${key}) <<`, value)
	}
}
