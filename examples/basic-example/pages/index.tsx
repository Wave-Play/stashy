import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { usePilot } from '@waveplay/pilot'
import Head from 'next/head'
import { useSafeAreaInsets } from '../core/use-safe-area'
import stashy, { Stashy } from '@waveplay/stashy'
import { EnvBackend } from '@waveplay/stashy/backend/env'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next'
import Inputs from '../components/inputs'

const KEY_BOOLEAN = 'boolean-example'
const KEY_NUMBER = 'selectedNum'
const KEY_STRING = 'input-string'

const envStashy = new Stashy({
	backend: new EnvBackend({
		exampleBackend: {
			doc: 'This is an example environment variable only available on the server',
			format: String,
			default: process.env.EXAMPLE_BACKEND,
			env: 'EXAMPLE_BACKEND'
		},
		public: {
			nextExample: {
				doc: 'This is an example environment variable available on all environments: server, browser, and native app',
				format: String,
				default: process.env.NEXT_PUBLIC_EXAMPLE_FRONTEND,
				env: 'NEXT_PUBLIC_EXAMPLE_FRONTEND'
			},
			pilotExample: {
				doc: 'This is an example environment variable available on only the server and native app',
				format: String,
				default: process.env.PILOT_PUBLIC_EXAMPLE_APP,
				env: 'PILOT_PUBLIC_EXAMPLE_APP'
			}
		}
	})
})

interface HomeProps {
	keyBoolean?: boolean
	keyNumber?: number
	keyString?: string
}
const Home: NextPage<HomeProps> = (props: HomeProps) => {
	const { keyBoolean = false, keyNumber = 0, keyString = '' } = props

	// Hooks
	const pilot = usePilot()
	const insets = useSafeAreaInsets()

	// Local state to show immediate changes
	const [envValues, setEnvValues] = useState({}) // Be careful not to use process.env directly here, as first render will be on the server
	const [isChecked, setChecked] = useState(keyBoolean)
	const [inputString, setInputString] = useState(keyString)
	const [selectedNumber, setSelectedNumber] = useState<number | undefined>(keyNumber)

	// This will restore the selected values from previous client session
	useEffect(() => {
		(async () => {
			setEnvValues({
				EXAMPLE_BACKEND: envStashy.getString('exampleBackend'),
				NEXT_PUBLIC_EXAMPLE_FRONTEND: envStashy.getString('public.nextExample'),
				PILOT_PUBLIC_EXAMPLE_APP: envStashy.getString('public.pilotExample')
			})
			setChecked(await stashy.getBooleanAsync(KEY_BOOLEAN))
			setInputString(await stashy.getStringAsync(KEY_STRING))
			setSelectedNumber(await stashy.getNumberAsync(KEY_NUMBER))
		})()
	}, [])

	// Just a simple example of how to store values of different types
	const onChangeTextInput = async (text: string) => {
		await stashy.set(KEY_STRING, text)
		setInputString(text)
	}
	const onPressCheckbox = () => {
		setChecked(!isChecked)
		stashy.set(KEY_BOOLEAN, !isChecked)
	}
	const onPressNumber = (number: number) => {
		setSelectedNumber(number)
		stashy.set(KEY_NUMBER, number)
	}
	const onPressReload = () => {
		pilot.reload()
	}
	const onPressSaveSsr = () => {
		pilot.fly({
			pathname: '/save',
			query: {
				[KEY_BOOLEAN]: String(isChecked),
				[KEY_NUMBER]: String(selectedNumber),
				[KEY_STRING]: inputString
			}
		})
	}

	return (
		<View style={styles.container}>
			<Head>
				<title>Stashy - Basic Example</title>
			</Head>
			<View style={[styles.headerContainer, { paddingTop: insets.top }]}>
				<Text style={styles.title}>Stashy: Basic Example</Text>
				<Text style={styles.description}>
					Change the values below and they will be saved for the next time you open this app
				</Text>
			</View>
			<Inputs
				envValues={envValues}
				isChecked={isChecked}
				inputString={inputString}
				onChangeTextInput={onChangeTextInput}
				onPressCheckbox={onPressCheckbox}
				onPressNumber={onPressNumber}
				onPressReload={onPressReload}
				onPressSaveSsr={onPressSaveSsr}
				selectedNumber={selectedNumber}
			/>
		</View>
	)
}
export default Home

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomeProps>> => {
	return {
		props: {
			keyBoolean: stashy.getBoolean(KEY_BOOLEAN, { context }) ?? null,
			keyNumber: stashy.getNumber(KEY_NUMBER, { context }) ?? null,
			keyString: stashy.getString(KEY_STRING, { context }) ?? null
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fafafa'
	},
	headerContainer: {
		width: '100%',
		backgroundColor: '#fff',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowOffset: { width: 0, height: 6 },
		shadowRadius: 2,
		boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
		paddingBottom: 24
	},
	title: {
		width: '100%',
		maxWidth: 800,
		fontSize: 24,
		fontWeight: '600',
		textAlign: 'center',
		marginTop: 16
	},
	description: {
		width: '100%',
		maxWidth: 800,
		fontSize: 16,
		marginTop: 8,
		textAlign: 'center',
		paddingLeft: 24,
		paddingRight: 24
	}
})
