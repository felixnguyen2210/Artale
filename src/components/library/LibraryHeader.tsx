import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Filter, Grid } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';

export const LibraryHeader = () => {
	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.title}>Library</Text>
				<Text style={styles.subtitle}>All your content in one place</Text>
			</View>
			<View style={styles.actions}>
				<TouchableOpacity style={styles.iconButton}>
					<Filter color={colors.text.primary} size={24} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.iconButton}>
					<Grid color={colors.text.primary} size={24} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: spacing.lg
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: colors.text.primary
	},
	subtitle: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: spacing.xs
	},
	actions: {
		flexDirection: 'row',
		gap: spacing.sm
	},
	iconButton: {
		padding: spacing.sm,
		backgroundColor: colors.glass.light,
		borderRadius: 12
	}
});
