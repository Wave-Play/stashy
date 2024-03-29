/**
 * © 2023 WavePlay <dev@waveplay.com>
 */
let Platform: any
try {
	Platform = require('react-native').Platform
} catch (e) {
	Platform = { OS: 'web' }
}

export function isNative(): boolean {
	return Platform.OS === 'android' || Platform.OS === 'ios'
}

export function isSSR(): boolean {
	return !isNative() && typeof window !== 'object'
}
