import React from 'react';
import { PilotArea, PilotRoute } from '@waveplay/pilot';
import * as HomePage from './pages';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
		<SafeAreaProvider>
			<PilotArea>
				<PilotRoute path={'/'} component={HomePage.default} default={true}/>
			</PilotArea>
		</SafeAreaProvider>
  );
}
