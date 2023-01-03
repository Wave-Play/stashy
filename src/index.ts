/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Stashy } from './core'
import { CookieBackend } from './backend/cookie'
import { LocalStorageBackend } from './backend/local-storage'
import { AsyncStorageBackend } from './backend/async-storage'
import { isNative, isSSR } from './utils'
import type { StashyBackend } from './backend/_base'

function getDefaultBackend(platform: 'native' | 'ssr' | 'web'): StashyBackend {
	if (isNative() && platform === 'native') {
		return new AsyncStorageBackend()
	} else if (isSSR() && platform === 'ssr') {
		return new CookieBackend()
	} else if (!isNative() && !isSSR() && platform === 'web') {
		return new LocalStorageBackend()
	} else {
		return null
	}
}

const stashy = new Stashy({
	backend: {
		native: getDefaultBackend('native'),
		ssr: getDefaultBackend('ssr'),
		web: getDefaultBackend('web')
	}
})

export * from './core'
export default stashy
