import React from 'react';
import { PilotArea, PilotRoute } from '@waveplay/pilot';
import * as HomePage from './pages';
import * as SavePage from './pages';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
		<SafeAreaProvider>
			<PilotArea config={{ logLevel: 'trace' }}>
				<PilotRoute path={'/'} component={HomePage.default} default={true}/>
				<PilotRoute path={'/save'} component={SavePage.default} getProps={SavePage.getServerSideProps}/>
			</PilotArea>
		</SafeAreaProvider>
  );
}
