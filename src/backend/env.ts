/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StashyBackend } from './_base';

type EnvDataItem = {
	doc?: string
	format?: any
	default?: any
	env: string
}

type EnvModel = {
	[key: string]: EnvDataItem | EnvModel
}

/**
 * Backend that accepts a structured object similar to the "convict" library as the source of truth
 * This allows you to use Stashy syntax for your environment variables
 */
export default class EnvBackend implements StashyBackend {
	private _data: { [key: string]: any }
	private readonly _model: EnvModel

	constructor(model: EnvModel) {
		this._model = model;
	}

	_get<T>(key: string): T {
		const parts = key.split('.');
		let data: unknown = this._data;
		for (const part of parts) {
			data = data?.[part];
		}

		// Return data, otherwise return default from model
		if (data !== undefined) {
			return data as T;
		} else {
			let model: EnvDataItem | EnvModel = this._model;
			for (const part of parts) {
				model = model?.[part];
			}
			return model?.default;
		}
	}

	_init() {
		this._data = extractValue(null, this._model, null);
	}

	clearAll(): void {
		throw new Error(`clearAll() is not supported for EnvBackend`);
	}

	clearAllAsync(): Promise<void> {
		throw new Error(`clearAllAsync() is not supported for EnvBackend`);
	}

	delete(): void {
		throw new Error(`delete() is not supported for EnvBackend`);
	}

	deleteAsync(): Promise<void> {
		throw new Error(`deleteAsync() is not supported for EnvBackend`);
	}

	getBoolean(key: string): boolean {
		return this._get(key);
	}

	getBooleanAsync(key: string): Promise<boolean> {
		return Promise.resolve(this.getBoolean(key));
	}

	getNumber(key: string): number {
		return this._get(key);
	}

	getNumberAsync(key: string): Promise<number> {
		return Promise.resolve(this.getNumber(key));
	}

	getString(key: string): string {
		return this._get(key);
	}

	getStringAsync(key: string): Promise<string> {
		return Promise.resolve(this.getString(key));
	}

	set(): void {
		throw new Error(`set() is not supported for EnvBackend`);
	}

	setAsync(): Promise<void> {
		throw new Error(`setAsync() is not supported for EnvBackend`);
	}
}

function extractValue(key: string | null, item: EnvDataItem | EnvModel | string, parent: EnvDataItem | EnvModel): any {
	if (typeof item === 'object') {
		if (typeof item['env'] === 'string') {
			const result = process.env[item['env']];
			return typeof parent.format === 'function' ? parent.format(result) : result;
		}

		// Nested object
		const data = {};
		for (const key in item) {
			data[key] = extractValue(key, item[key], item);
		}
		return data;
	} else if (key === 'env') {
		// "env" keys should be either a string or an object
		throw new Error(`Invalid env key: ${key}`);
	}
};
