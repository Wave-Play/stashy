/**
 * © 2023 WavePlay <dev@waveplay.com>
 */
import { Platform } from 'react-native'

export function isNative(): boolean {
	return Platform.OS === 'android' || Platform.OS === 'ios'
}

export function isSSR(): boolean {
	return !isNative() && typeof window !== 'object'
}
