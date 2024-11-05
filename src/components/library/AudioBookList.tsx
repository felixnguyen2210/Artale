import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAudioBooks } from '../../hooks/useAudioBooks';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';

export const AudioBookList = () => {
	const { data, isLoading, error } = useAudioBooks({
		limit: 20,
		page: 1
	});

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size='large' color={colors.primary} />
				<Text style={styles.loadingText}>Loading audiobooks...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Error loading audiobooks.</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Available Audiobooks</Text>
			{data?.books.map((book) => (
				<GlassContainer key={book.id} style={styles.bookCard}>
					<Text style={styles.bookTitle}>{book.title}</Text>
					<Text style={styles.bookAuthor}>{book.author}</Text>
					<Text style={styles.bookDuration}>
						Duration: {Math.floor(book.duration / 60)} minutes
					</Text>
				</GlassContainer>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.md
	},
	loadingContainer: {
		padding: spacing.xl,
		alignItems: 'center'
	},
	loadingText: {
		color: colors.text.secondary,
		marginTop: spacing.md
	},
	errorContainer: {
		padding: spacing.xl,
		alignItems: 'center'
	},
	errorText: {
		color: colors.text.secondary
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: spacing.md
	},
	bookCard: {
		marginBottom: spacing.md,
		padding: spacing.md
	},
	bookTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary
	},
	bookAuthor: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4
	},
	bookDuration: {
		fontSize: 12,
		color: colors.text.tertiary,
		marginTop: 4
	}
});
