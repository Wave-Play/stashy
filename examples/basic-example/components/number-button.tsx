import { COLOR, COLOR_BACKGROUND } from '../core/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface NumberButtonProps {
	index: number
	number: number
	onPress: (number: number) => void
	selected?: boolean
}
const NumberButton = (props: NumberButtonProps) => {
	const { index, number, onPress, selected } = props;

	return (
		<TouchableOpacity key={number} style={[styles.container, {
			backgroundColor: selected ? COLOR_BACKGROUND : undefined,
			borderColor: COLOR_BACKGROUND,
			borderWidth: selected ? 0 : 2,
			marginLeft: index === 0 ? 0 : 8
		}]} onPress={() => {console.log(`Pressing ${number}`); onPress(number)}}>
			<Text style={styles.text}>{number}</Text>
		</TouchableOpacity>
	)
};
export default NumberButton;
 
const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: 48,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: 24,
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 16
	},
	text: {
		color: COLOR,
		fontSize: 20,
		fontWeight: '600'
	}
});
