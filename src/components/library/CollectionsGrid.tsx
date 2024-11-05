import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Collection } from '../../types/collection';
import { CollectionCard } from './CollectionCard';

export const CollectionsGrid = () => {
	// Mock data - will be replaced with real data later
	const collections: Collection[] = [
		{
			id: '1',
			name: 'Sci-Fi Favorites',
			itemCount: 12,
			mediaTypes: ['audio'],
			color: colors.mediaTypes.audio
		},
		{
			id: '2',
			name: 'Classic Novels',
			itemCount: 8,
			mediaTypes: ['ebook'],
			color: colors.mediaTypes.ebook
		},
		{
			id: '3',
			name: 'Art History',
			itemCount: 15,
			mediaTypes: ['art'],
			color: colors.mediaTypes.art
		},
		{
			id: '4',
			name: 'Poetry',
			itemCount: 6,
			mediaTypes: ['audio', 'ebook'],
			color: colors.mediaTypes.movie
		}
	];

	const handleCollectionPress = (collectionId: string) => {
		console.log('Collection pressed:', collectionId);
		// Will implement navigation later
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Your Collections</Text>
			<View style={styles.grid}>
				{collections.map((collection) => (
					<CollectionCard
						key={collection.id}
						collection={collection}
						onPress={handleCollectionPress}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.lg
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.text.primary,
		marginBottom: spacing.md
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md
	}
});
