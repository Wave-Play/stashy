import type { AppProps } from 'next/app'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = ({ Component, pageProps }: AppProps) => {
  return (
		<SafeAreaProvider>
			<Component {...pageProps} />
		</SafeAreaProvider>
	)
}
export default App
