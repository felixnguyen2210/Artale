import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	RefreshControl
} from 'react-native';
import { useAudioBooks } from '../../hooks/useAudioBooks';
import { AudioBookCard } from './AudioBookCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AudioBook } from '../../services/audioBooks/types';

interface AudioBookListProps {
	searchQuery?: string;
	category?: string;
}

export const AudioBookList = ({
	searchQuery,
	category
}: AudioBookListProps) => {
	const [page, setPage] = useState(1);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const { data, isLoading, error, refetch, isRefetching } = useAudioBooks({
		limit: 20,
		page,
		query: searchQuery,
		genre: category !== 'All' ? category : undefined
	});

	const handleBookPress = (book: AudioBook) => {
		// We'll implement this when we add audio player functionality
		console.log('Book pressed:', book.title);
	};

	const handleRefresh = () => {
		setPage(1);
		refetch();
	};

	const handleLoadMore = () => {
		if (isLoadingMore) return;
		if (!data || page >= data.totalPages) return;

		setIsLoadingMore(true);
		setPage((prev) => prev + 1);
		setIsLoadingMore(false);
	};

	const renderFooter = () => {
		if (!isLoadingMore) return null;

		return (
			<View style={styles.footerLoader}>
				<ActivityIndicator size='small' color={colors.primary} />
			</View>
		);
	};

	if (isLoading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size='large' color={colors.primary} />
				<Text style={styles.loadingText}>Loading audiobooks...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.errorText}>
					Error loading audiobooks. Please try again.
				</Text>
			</View>
		);
	}

	const renderBook = ({ item }: { item: AudioBook }) => (
		<AudioBookCard book={item} onPress={handleBookPress} />
	);

	return (
		<FlatList
			data={data?.books}
			renderItem={renderBook}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={isRefetching}
					onRefresh={handleRefresh}
					tintColor={colors.primary}
					colors={[colors.primary]}
				/>
			}
			onEndReached={handleLoadMore}
			onEndReachedThreshold={0.5}
			ListFooterComponent={renderFooter}
			ListEmptyComponent={
				<Text style={styles.emptyText}>No audiobooks found</Text>
			}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.md,
		flexGrow: 1
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.xl
	},
	loadingText: {
		marginTop: spacing.md,
		color: colors.text.secondary,
		fontSize: 14
	},
	errorText: {
		color: colors.text.secondary,
		fontSize: 14,
		textAlign: 'center'
	},
	emptyText: {
		color: colors.text.secondary,
		fontSize: 14,
		textAlign: 'center',
		marginTop: spacing.xl
	},
	footerLoader: {
		paddingVertical: spacing.md,
		alignItems: 'center'
	}
});
