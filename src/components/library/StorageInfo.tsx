import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';

export const StorageInfo = () => {
	const usedStorage = 2.4;
	const totalStorage = 5;
	const percentageUsed = (usedStorage / totalStorage) * 100;

	return (
		<GlassContainer style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Storage Used:</Text>
				<TouchableOpacity>
					<Text style={styles.manageButton}>Manage</Text>
				</TouchableOpacity>
			</View>
			<Text style={styles.storageText}>
				{usedStorage}GB/{totalStorage}GB
			</Text>
			<View style={styles.progressContainer}>
				<View style={[styles.progressBar, { width: `${percentageUsed}%` }]} />
			</View>
		</GlassContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: spacing.lg,
		padding: spacing.md
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontSize: 16,
		color: colors.text.primary
	},
	manageButton: {
		fontSize: 14,
		color: colors.primary
	},
	storageText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.text.primary,
		marginTop: spacing.sm
	},
	progressContainer: {
		height: 4,
		backgroundColor: colors.glass.light,
		borderRadius: 2,
		marginTop: spacing.md,
		overflow: 'hidden'
	},
	progressBar: {
		height: '100%',
		backgroundColor: colors.primary,
		borderRadius: 2
	}
});
