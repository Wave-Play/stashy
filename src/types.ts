/**
 * © 2022 WavePlay <dev@waveplay.com>
 */

export interface Logger {
	debug: (...args: any[]) => void
	error: (...args: any[]) => void
	info: (...args: any[]) => void
	warn: (...args: any[]) => void
	trace: (...args: any[]) => void
}
