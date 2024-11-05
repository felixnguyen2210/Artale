import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AudioBookCard } from './AudioBookCard';

interface RecentItem {
	id: string;
	title: string;
	author: string;
	addedDate: string;
	coverUrl?: string;
}

export const RecentlyAdded = () => {
	// Mock data - later will come from API
	const recentBook: RecentItem = {
		id: '1',
		title: 'Project Hail Mary',
		author: 'Andy Weir',
		addedDate: '2 days ago',
		coverUrl: undefined
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Recently Added</Text>
				<TouchableOpacity>
					<Text style={styles.seeAll}>See All</Text>
				</TouchableOpacity>
			</View>
			<AudioBookCard book={recentBook} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.lg
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.text.primary
	},
	seeAll: {
		fontSize: 14,
		color: colors.primary
	}
});
