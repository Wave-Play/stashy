/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Stashy } from '..'
// @ts-expect-error (peer dependency)
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export const atomWithStashy = <T>(stashy: Stashy, key: string, initialValue: T) =>
	atomWithStorage<T>(
		key,
		initialValue,
		createJSONStorage<T>(() => ({
			getItem: <T>(key: string): T | null => stashy.get(key, { silent: true }),
			setItem: <T>(key: string, value: T): void => stashy.set(key, value, { silent: true }),
			removeItem: (key: string): void => stashy.delete(key, { silent: true }),
			clearAll: (): void => stashy.clearAll({ silent: true })
		}))
	)
