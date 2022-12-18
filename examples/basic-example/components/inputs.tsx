import { COLOR, COLOR_BACKGROUND } from '../core/constants'
import { useSafeAreaInsets } from '../core/use-safe-area'
import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import NumberButton from './number-button'

const NUMBERS = [1, 2, 3]

interface InputsProps {
	envValues: { [key: string]: string | undefined }
	inputString: string
	isChecked: boolean
	onChangeTextInput: (text: string) => void
	onPressCheckbox: () => void
	onPressNumber: (number: number) => void
	onPressReload: () => void
	onPressSaveSsr: () => void
	selectedNumber?: number
}
const Inputs: FunctionComponent<InputsProps> = (props: InputsProps) => {
	const {
		envValues,
		inputString,
		isChecked,
		onChangeTextInput,
		onPressCheckbox,
		onPressNumber,
		onPressReload,
		onPressSaveSsr,
		selectedNumber
	} = props
	const insets = useSafeAreaInsets()
	const hasEnvValues = Object.values(envValues).filter(Boolean).length > 0

	return (
		<ScrollView
			style={styles.contentScroll}
			contentContainerStyle={[styles.contentScrollContainer, { paddingBottom: insets.bottom }]}
		>
			<View style={styles.contentContainer}>
				<View style={styles.numbersContainer}>
					{NUMBERS.map((number, index) => (
						<NumberButton
							key={number}
							index={index}
							number={number}
							onPress={onPressNumber}
							selected={selectedNumber === number}
						/>
					))}
				</View>
				<View style={styles.inputContainer}>
					<TextInput style={styles.input} onChangeText={onChangeTextInput} value={inputString} />
				</View>
				<View style={styles.checkboxContainer}>
					<TouchableOpacity
						style={[
							styles.checkbox,
							{
								backgroundColor: isChecked ? COLOR : undefined
							}
						]}
						onPress={onPressCheckbox}
					/>
					<Text style={styles.checkboxLabel}>Boolean example</Text>
				</View>
				{hasEnvValues ? (
					<View style={styles.envContainer}>
						<TextInput
							style={styles.env}
							editable={false}
							multiline={true}
							value={JSON.stringify(envValues, undefined, 2)}
						></TextInput>
					</View>
				) : null}
				<TouchableOpacity style={styles.reloadContainer} onPress={onPressReload}>
					<Text style={styles.reload}>Reload</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.saveSsrContainer} onPress={onPressSaveSsr}>
					<Text style={styles.saveSsr}>Save in SSR</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}
export default Inputs

const styles = StyleSheet.create({
	contentScroll: {
		width: '100%',
		flex: 1
	},
	contentScrollContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	contentContainer: {
		width: '100%',
		maxWidth: 800,
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
	envContainer: {
		width: '100%',
		marginTop: 24,
		paddingLeft: 16,
		paddingRight: 16
	},
	env: {
		width: '100%',
		height: 224,
		backgroundColor: 'white',
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.06,
		shadowRadius: 4,
		paddingTop: 12,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 12
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
})
