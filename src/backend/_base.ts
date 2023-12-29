/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { GetServerSidePropsContext } from 'next'
import type { Stashy } from '..'
import type { Logger } from '../types'

export interface StashyOptions {
	backend?: 'native' | 'ssr' | 'web'
	context?: GetServerSidePropsContext
	default?: any
	domain?: string
	maxAge?: number
	path?: string
	secure?: boolean
	silent?: boolean
}

export interface StashyBackendInitOptions {
	id?: string
	logger?: Logger
	stashy: Stashy
}

export interface StashyBackend {
	_init: (StashyBackendInitOptions) => void
	clearAll: (options?: StashyOptions) => void
	clearAllAsync: (options?: StashyOptions) => Promise<void>
	delete: (key: string, options?: StashyOptions) => void
	deleteAsync: (key: string, options?: StashyOptions) => Promise<void>
	getBoolean: (key: string, options?: StashyOptions) => boolean
	getBooleanAsync: (key: string, options?: StashyOptions) => Promise<boolean>
	getNumber: (key: string, options?: StashyOptions) => number
	getNumberAsync: (key: string, options?: StashyOptions) => Promise<number>
	getString: (key: string, options?: StashyOptions) => string
	getStringAsync: (key: string, options?: StashyOptions) => Promise<string>
	set: (key: string, value: boolean | number | string, options?: StashyOptions) => void
	setAsync: (key: string, value: boolean | number | string, options?: StashyOptions) => Promise<void>
}
