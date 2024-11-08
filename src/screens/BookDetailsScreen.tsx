import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Book, ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { GradientBackground } from '../components/common/GradientBackground';
import { GlassContainer } from '../components/common/GlassContainer';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BookDetailsRouteProp = RouteProp<RootStackParamList, 'BookDetails'>;

const BookDetailsScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const route = useRoute<BookDetailsRouteProp>();
	const { book } = route.params;

	const handleStartListening = () => {
		navigation.navigate('AudioPlayer', { book });
	};

	return (
		<SafeAreaView style={styles.container}>
			<GradientBackground>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.iconButton}>
						<ChevronLeft color={colors.text.primary} size={24} />
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}>
					{/* Cover Art */}
					<View style={styles.coverArt}>
						{book.coverUrl ? (
							<Image
								source={{ uri: book.coverUrl }}
								style={styles.coverImage}
							/>
						) : (
							<View style={styles.placeholderCover}>
								<Book color={colors.text.primary} size={64} />
							</View>
						)}
					</View>

					<GlassContainer style={styles.infoContainer}>
						{/* Book Info */}
						<View style={styles.bookInfo}>
							<Text style={styles.title}>{book.title}</Text>
							<Text style={styles.author}>{book.author}</Text>
						</View>

						{/* Additional Metadata */}
						{book.description && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>About</Text>
								<Text style={styles.description}>{book.description}</Text>
							</View>
						)}

						{/* Genres */}
						{book.genres.length > 0 && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Genres</Text>
								<View style={styles.genreContainer}>
									{book.genres.map((genre, index) => (
										<View key={index} style={styles.genreTag}>
											<Text style={styles.genreText}>{genre}</Text>
										</View>
									))}
								</View>
							</View>
						)}

						{/* Chapters Preview */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Chapters</Text>
							<View style={styles.chaptersList}>
								{book.chapters.slice(0, 3).map((chapter, index) => (
									<View key={index} style={styles.chapterItem}>
										<Text style={styles.chapterTitle} numberOfLines={1}>
											{chapter.title}
										</Text>
									</View>
								))}
								{book.chapters.length > 3 && (
									<Text style={styles.moreChapters}>
										+{book.chapters.length - 3} more chapters
									</Text>
								)}
							</View>
						</View>
					</GlassContainer>
				</ScrollView>

				{/* Start Button */}
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.startButton}
						onPress={handleStartListening}>
						<Text style={styles.buttonText}>Start Listening</Text>
					</TouchableOpacity>
				</View>
			</GradientBackground>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md
	},
	iconButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.glass.light,
		justifyContent: 'center',
		alignItems: 'center'
	},
	scrollView: {
		flex: 1
	},
	coverArt: {
		alignItems: 'center',
		marginVertical: spacing.xl
	},
	coverImage: {
		width: '70%',
		aspectRatio: 2 / 3,
		borderRadius: 12
	},
	placeholderCover: {
		width: '70%',
		aspectRatio: 2 / 3,
		borderRadius: 12,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	},
	infoContainer: {
		margin: spacing.md,
		padding: spacing.lg
	},
	bookInfo: {
		alignItems: 'center',
		marginBottom: spacing.lg
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.text.primary,
		textAlign: 'center'
	},
	author: {
		fontSize: 16,
		color: colors.text.secondary,
		marginTop: spacing.sm
	},
	section: {
		marginTop: spacing.lg
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: spacing.sm
	},
	description: {
		fontSize: 14,
		color: colors.text.secondary,
		lineHeight: 20
	},
	genreContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm
	},
	genreTag: {
		backgroundColor: colors.glass.medium,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: 16
	},
	genreText: {
		fontSize: 14,
		color: colors.text.primary
	},
	chaptersList: {
		gap: spacing.sm
	},
	chapterItem: {
		padding: spacing.sm,
		backgroundColor: colors.glass.light,
		borderRadius: 8
	},
	chapterTitle: {
		fontSize: 14,
		color: colors.text.primary
	},
	moreChapters: {
		fontSize: 14,
		color: colors.text.secondary,
		textAlign: 'center',
		marginTop: spacing.xs
	},
	buttonContainer: {
		padding: spacing.md
	},
	startButton: {
		backgroundColor: colors.primary,
		padding: spacing.md,
		borderRadius: 12,
		alignItems: 'center'
	},
	buttonText: {
		color: colors.text.primary,
		fontSize: 16,
		fontWeight: '600'
	}
});

export default BookDetailsScreen;
