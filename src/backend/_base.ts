/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { GetServerSidePropsContext } from 'next';

export interface StashyOptions {
	context?: GetServerSidePropsContext
	domain?: string
	maxAge?: number
	path?: string
	secure?: boolean
	silent?: boolean
}

export interface StashyBackendInitOptions {
	id?: string
}

export interface StashyBackend {
	_init: (StashyBackendInitOptions) => void
	clearAll: (options?: StashyOptions) => void
	delete: (key: string, options?: StashyOptions) => void
	getBoolean: (key: string, options?: StashyOptions) => boolean
	getNumber: (key: string, options?: StashyOptions) => number
	getString: (key: string, options?: StashyOptions) => string
	set: (key: string, value: boolean | number | string, options?: StashyOptions) => void
}
