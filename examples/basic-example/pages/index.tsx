import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePilot } from '@waveplay/pilot';
import Head from 'next/head';
import { useSafeAreaInsets } from '../core/use-safe-area';
import NumberButton from '../components/number-button';
import stashy from '@waveplay/stashy';
import { COLOR, COLOR_BACKGROUND } from '../core/constants';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';

const NUMBERS = [ 1, 2, 3 ];
const KEY_BOOLEAN = 'boolean-example';
const KEY_NUMBER = 'selectedNum';
const KEY_STRING = 'input-string';

interface HomeProps {
	keyBoolean?: boolean
	keyNumber?: number
	keyString?: string
}
const Home: NextPage<HomeProps> = (props: HomeProps) => {
	const {
		keyBoolean = false,
		keyNumber = 0,
		keyString = ''
	} = props;

	// Hooks
	const pilot = usePilot();
	const insets = useSafeAreaInsets();

	// Local state to show immediate changes
	const [ isChecked, setChecked ] = useState(keyBoolean);
	const [ inputString, setInputString ] = useState(keyString);
	const [ selectedNumber, setSelectedNumber ] = useState<number | undefined>(keyNumber);

	// This will restore the selected values from previous session
	useEffect(() => {
		(async () => {
			setChecked(await stashy.getBooleanAsync(KEY_BOOLEAN));
			setInputString(await stashy.getStringAsync(KEY_STRING));
			setSelectedNumber(await stashy.getNumberAsync(KEY_NUMBER));
		})();
	}, []);

	// Just a simple example of how to store values of different types
	const onChangeTextInput = async (text: string) => {
		await stashy.set(KEY_STRING, text);
		setInputString(text);
	};
	const onPressCheckbox = () => {
		setChecked(!isChecked);
		stashy.set(KEY_BOOLEAN, !isChecked);
	};
	const onPressNumber = (number: number) => {
		setSelectedNumber(number);
		stashy.set(KEY_NUMBER, number);
	};
	const onPressReload = () => {
		pilot.reload();
	};
	const onPressSaveSsr = () => {
		pilot.fly({
			pathname: '/save',
			query: {
				[KEY_BOOLEAN]: String(isChecked),
				[KEY_NUMBER]: String(selectedNumber),
				[KEY_STRING]: inputString
			}
		});
	};

	return (
		<View style={styles.container}>
			<Head>
				<title>Stashy - Basic Example</title>
			</Head>
			<View style={[styles.headerContainer, { paddingTop: insets.top }]}>
				<Text style={styles.title}>Stashy: Basic Example</Text>
				<Text style={styles.description}>Change the values below and they will be saved for the next time you open this app</Text>
			</View>
			<ScrollView style={styles.contentScroll} contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
				<View style={styles.numbersContainer}>
					{ NUMBERS.map((number, index) => (
						<NumberButton key={number} index={index} number={number} onPress={onPressNumber} selected={selectedNumber === number}/>
					)) }
				</View>
				<View style={styles.inputContainer}>
					<TextInput style={styles.input} onChangeText={onChangeTextInput} value={inputString}/>
				</View>
				<View style={styles.checkboxContainer}>
					<TouchableOpacity style={[styles.checkbox, {
						backgroundColor: isChecked ? COLOR : undefined
					}]} onPress={onPressCheckbox}/>
					<Text style={styles.checkboxLabel}>Boolean example</Text>
				</View>
				<TouchableOpacity style={styles.reloadContainer} onPress={onPressReload}>
					<Text style={styles.reload}>Reload</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.saveSsrContainer} onPress={onPressSaveSsr}>
					<Text style={styles.saveSsr}>Save in SSR</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
};
export default Home;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<HomeProps>> => {
	return {
		props: {
			keyBoolean: stashy.getBoolean(KEY_BOOLEAN, { context }),
			keyNumber: stashy.getNumber(KEY_NUMBER, { context }),
			keyString: stashy.getString(KEY_STRING, { context })
		}
	};
};
 
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
		shadowOpacity: .06,
		shadowOffset: { width: 0, height: 6 },
		shadowRadius: 2,
		boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
		paddingBottom: 24
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		marginTop: 16
	},
	description: {
		fontSize: 16,
		marginTop: 8,
		textAlign: 'center',
		paddingLeft: 24,
		paddingRight: 24
	},
	contentScroll: {
		width: '100%',
		flex: 1
	},
	contentContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	numbersContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		paddingLeft: 24,
		paddingRight: 24,
		marginTop: 16
	},
	numberButton: {
		flex: 1,
		height: 48,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: 'teal',
		borderRadius: 24,
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 16
	},
	numberButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '400'
	},
	inputContainer: {
		width: '100%',
		height: 48,
		marginTop: 24
	},
	input: {
		height: 48,
		borderColor: COLOR_BACKGROUND,
		borderRadius: 24,
		borderWidth: 2,
		paddingLeft: 16,
		paddingRight: 16,
		position: 'absolute',
		left: 16,
		right: 16
	},
	checkboxContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginTop: 24
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: COLOR_BACKGROUND,
		marginLeft: 16,
		marginRight: 16
	},
	checkboxLabel: {
		fontSize: 16,
		fontWeight: '400'
	},
	reloadContainer: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 24
	},
	reload: {
		fontSize: 16,
		fontWeight: '400',
		color: COLOR
	},
	saveSsrContainer: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 24
	},
	saveSsr: {
		fontSize: 16,
		fontWeight: '400',
		color: COLOR
	}
});
