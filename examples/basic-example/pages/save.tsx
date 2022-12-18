import { usePilot } from '@waveplay/pilot'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Simple redirect page to show how SSR saves work
// It's not actually necessary, but good to show something is happening in this example
const SavePage: NextPage = () => {
	const pilot = usePilot()

	const onPressRedirect = () => {
		pilot.fly({
			pathname: '/save-ssr',
			query: pilot.getQuery()
		})
	}

	useEffect(() => {
		setTimeout(onPressRedirect, 1000)
	}, [])

	return (
		<View style={styles.container}>
			<Text style={styles.saveText}>Saving via SSR...</Text>
			<TouchableOpacity style={styles.redirectButton} onPress={onPressRedirect}>
				<Text style={styles.redirectText}>Click here if you're not redirected in 5 seconds</Text>
			</TouchableOpacity>
		</View>
	)
}
export default SavePage

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fafafa'
	},
	redirectButton: {
		height: 48,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	redirectText: {
		color: '#2196f3',
		fontSize: 12,
		fontWeight: '400'
	},
	saveText: {
		fontSize: 20,
		fontWeight: '600'
	}
})
