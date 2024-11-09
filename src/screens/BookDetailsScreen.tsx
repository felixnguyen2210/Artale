// src/screens/BookDetailsScreen.tsx
import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Book, ChevronDown, Clock } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { GradientBackground } from '../components/common/GradientBackground';
import { GlassContainer } from '../components/common/GlassContainer';
import { RootStackParamList } from '../types/navigation';
import { decode } from 'html-entities';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BookDetailsRouteProp = RouteProp<RootStackParamList, 'BookDetails'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_WIDTH = SCREEN_WIDTH * 0.6;

// Add this helper function
const cleanDescription = (description: string): string => {
	// Remove HTML tags
	const withoutHtml = description.replace(/<[^>]*>/g, '');
	// Remove metadata info (content after first double newline)
	const mainDescription = withoutHtml.split('\n\n')[0];
	// Decode HTML entities
	return decode(mainDescription);
};

const BookDetailsScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const route = useRoute<BookDetailsRouteProp>();
	const { book } = route.params;

	const handleStartListening = () => {
		navigation.navigate('AudioPlayer', { book });
	};
	const publishYear = book.publishedDate && (
		<View style={styles.publishedContainer}>
			<Text style={styles.publishedText}>
				Published in {book.publishedDate}
			</Text>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<GradientBackground>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.iconButton}>
						<ChevronDown color={colors.text.primary} size={24} />
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}>
					{/* Cover Art */}
					<View style={styles.coverContainer}>
						<GlassContainer style={styles.coverWrapper}>
							{book.coverUrl ? (
								<Image
									source={{ uri: book.coverUrl }}
									style={styles.coverImage}
									resizeMode='cover'
								/>
							) : (
								<View style={styles.placeholderCover}>
									<Book color={colors.text.primary} size={64} />
								</View>
							)}
						</GlassContainer>
					</View>

					{/* Book Info */}
					<GlassContainer style={styles.infoContainer}>
						<Text style={styles.title}>{book.title}</Text>
						<Text style={styles.author}>{book.author}</Text>

						{book.publishedDate && (
							<View style={styles.publishedContainer}>
								<Text style={styles.publishedText}>
									Published in {book.publishedDate}
								</Text>
							</View>
						)}

						{/* Duration */}
						<View style={styles.durationContainer}>
							<Clock color={colors.text.primary} size={16} />
							<Text style={styles.duration}>
								{Math.floor(book.duration / 3600)}h{' '}
								{Math.floor((book.duration % 3600) / 60)}m
							</Text>
						</View>

						{/* Genres */}
						{book.genres.length > 0 && (
							<View style={styles.genresContainer}>
								{book.genres.map((genre, index) => (
									<GlassContainer key={index} style={styles.genreTag}>
										<Text style={styles.genreText}>{genre}</Text>
									</GlassContainer>
								))}
							</View>
						)}

						{/* Description */}
						{book.description && (
							<View style={styles.descriptionContainer}>
								<Text style={styles.sectionTitle}>About this Book</Text>
								<Text style={styles.description}>
									{cleanDescription(book.description)}
								</Text>
							</View>
						)}

						{/* Chapters Preview */}
						<View style={styles.chaptersContainer}>
							<Text style={styles.sectionTitle}>Chapters</Text>
							<ScrollView
								style={styles.chaptersScroll}
								nestedScrollEnabled
								showsVerticalScrollIndicator={false}>
								{book.chapters.map((chapter, index) => (
									<GlassContainer key={index} style={styles.chapterItem}>
										<View style={styles.chapterNumberContainer}>
											<Text style={styles.chapterNumber}>{index + 1}</Text>
										</View>
										<View style={styles.chapterInfo}>
											<Text style={styles.chapterTitle} numberOfLines={2}>
												{chapter.title}
											</Text>
											<Text style={styles.chapterDuration}>
												{Math.floor(chapter.duration / 60)}:
												{(chapter.duration % 60).toString().padStart(2, '0')}
											</Text>
										</View>
									</GlassContainer>
								))}
							</ScrollView>
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
	coverContainer: {
		alignItems: 'center',
		marginVertical: spacing.xl
	},
	coverWrapper: {
		width: COVER_WIDTH,
		height: COVER_WIDTH * 1.5,
		padding: 0,
		overflow: 'hidden'
	},
	coverImage: {
		width: '100%',
		height: '100%',
		borderRadius: 12
	},
	placeholderCover: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 12
	},
	infoContainer: {
		margin: spacing.md,
		padding: spacing.lg,
		gap: spacing.md
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
		textAlign: 'center'
	},
	durationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.xs
	},
	duration: {
		fontSize: 14,
		color: colors.text.secondary
	},
	genresContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: spacing.sm
	},
	genreTag: {
		padding: spacing.xs,
		borderRadius: 16
	},
	genreText: {
		fontSize: 12,
		color: colors.text.primary
	},
	descriptionContainer: {
		gap: spacing.sm
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: spacing.xs
	},
	description: {
		fontSize: 14,
		color: colors.text.secondary,
		lineHeight: 20
	},
	chaptersContainer: {
		gap: spacing.sm
	},
	chaptersList: {
		gap: spacing.sm
	},
	chapterItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.sm,
		marginBottom: spacing.sm
	},
	chapterTitle: {
		flex: 1,
		fontSize: 14,
		color: colors.text.primary
	},
	chapterDuration: {
		fontSize: 12,
		color: colors.text.secondary,
		marginLeft: spacing.sm
	},
	moreChapters: {
		fontSize: 12,
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
	},
	publishedContainer: {
		alignItems: 'center',
		marginTop: spacing.xs
	},
	publishedText: {
		fontSize: 14,
		color: colors.text.secondary
	},
	chaptersScroll: {
		maxHeight: 300, // Limit height to make it scrollable
		marginTop: spacing.sm
	},
	chapterNumberContainer: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: spacing.sm
	},
	chapterNumber: {
		fontSize: 12,
		fontWeight: '500',
		color: colors.text.primary
	},
	chapterInfo: {
		flex: 1,
		gap: spacing.xs
	}
});

export default BookDetailsScreen;
