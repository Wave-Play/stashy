import * as React from 'react'
import { registerRootComponent } from 'expo'
import { loadEnv } from '@waveplay/pilot/env'
import { PilotArea } from '@waveplay/pilot'
import { SafeAreaProvider } from 'react-native-safe-area-context'

loadEnv()

function App() {
	return (
		<SafeAreaProvider>
			<PilotArea/>
		</SafeAreaProvider>
	)
}
export default registerRootComponent(App)
