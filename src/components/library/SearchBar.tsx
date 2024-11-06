import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';

interface SearchBarProps {
	value: string;
	onChangeText: (text: string) => void;
	onClear: () => void;
	isLoading?: boolean;
}

export const SearchBar = ({
	value,
	onChangeText,
	onClear,
	isLoading
}: SearchBarProps) => {
	return (
		<GlassContainer style={styles.container}>
			<Search color={colors.text.secondary} size={20} />
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder='Search audiobooks...'
				placeholderTextColor={colors.text.secondary}
				style={styles.input}
				autoCapitalize='none'
				autoCorrect={false}
			/>
			{value.length > 0 && (
				<TouchableOpacity onPress={onClear}>
					<X color={colors.text.secondary} size={20} />
				</TouchableOpacity>
			)}
		</GlassContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.sm,
		marginHorizontal: spacing.md,
		marginVertical: spacing.sm
	},
	input: {
		flex: 1,
		marginHorizontal: spacing.sm,
		fontSize: 16,
		color: colors.text.primary
	}
});
