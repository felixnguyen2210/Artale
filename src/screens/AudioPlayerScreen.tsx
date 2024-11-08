import React, { useState, useEffect } from 'react';
import {
	Animated,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
	ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	ChevronDown,
	Book,
	List,
	Clock,
	Settings,
	Share2
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { GradientBackground } from '../components/common/GradientBackground';
import { PlayerControls } from '../components/player/PlayerControls';
import { ProgressBar } from '../components/player/ProgressBar';
import { PlaybackSettings } from '../components/player/PlaybackSettings';
import { ChapterList } from '../components/player/ChapterList';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Chapter } from '../types/audio';
import { GlassContainer } from '../components/common/GlassContainer';
import { useSlideAnimation } from '../hooks/useSlideAnimation';
import type { RootStackParamList } from '../types/navigation';
import { SleepTimer } from '../components/player/SleepTimer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AudioPlayerRouteProp = RouteProp<RootStackParamList, 'AudioPlayer'>;

const AudioPlayerScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const route = useRoute<AudioPlayerRouteProp>();
	const { book } = route.params || {};
	const [isLoading, setIsLoading] = useState(true);
	const {
		state,
		loadBook,
		play,
		pause,
		seekTo,
		setPlaybackRate,
		skipForward,
		skipBackward,
		navigateToChapter,
		setSleepTimer
	} = useAudioPlayer();

	const [showChapters, setShowChapters] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showSleepTimer, setShowSleepTimer] = useState(false);

	const chaptersAnimation = useSlideAnimation(showChapters);
	const settingsAnimation = useSlideAnimation(showSettings);
	const overlayAnimation = useSlideAnimation(showChapters || showSettings);
	const sleepTimerAnimation = useSlideAnimation(showSleepTimer);

	useEffect(() => {
		const setupAudioPlayer = async () => {
			try {
				setIsLoading(true);
				// If we have a book from params and it's different from current book, load it
				if (book && (!state.currentBook || book.id !== state.currentBook.id)) {
					await loadBook(book);
					await play();
				} else if (state.currentBook) {
					// We're returning from MiniPlayer, no need to reload
					setIsLoading(false);
				} else {
					throw new Error('No book data available');
				}
			} catch (error) {
				console.error('Error setting up audio player:', error);
			} finally {
				setIsLoading(false);
			}
		};

		setupAudioPlayer();
	}, [book?.id, state.currentBook?.id]);

	const handlePlayPause = async () => {
		if (state.isPlaying) {
			await pause();
		} else {
			await play();
		}
	};

	const handleSleepTimer = () => {
		setShowSleepTimer(true);
	};

	const handleSetSleepTimer = (minutes: number) => {
		setSleepTimer(minutes);
		setShowSleepTimer(false);
	};

	const handleCancelSleepTimer = () => {
		setSleepTimer(null);
		setShowSleepTimer(false);
	};

	const handleChapterPress = async (chapter: Chapter) => {
		try {
			await navigateToChapter(chapter);
			setShowChapters(false);
		} catch (error) {
			console.error('Error seeking to chapter:', error);
		}
	};

	// Add validation
	if (!book) {
		return (
			<SafeAreaView style={styles.container}>
				<GradientBackground>
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>Book data not found</Text>
						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={styles.errorButton}>
							<Text style={styles.errorButtonText}>Go Back</Text>
						</TouchableOpacity>
					</View>
				</GradientBackground>
			</SafeAreaView>
		);
	}

	// Add loading state
	if (isLoading && !state.currentBook) {
		return (
			<SafeAreaView style={styles.container}>
				<GradientBackground>
					<View style={styles.loadingContainer}>
						<ActivityIndicator size='large' color={colors.primary} />
					</View>
				</GradientBackground>
			</SafeAreaView>
		);
	}

	if (!state.currentBook) {
		return (
			<SafeAreaView style={styles.container}>
				<GradientBackground>
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>Book data not found</Text>
						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={styles.errorButton}>
							<Text style={styles.errorButtonText}>Go Back</Text>
						</TouchableOpacity>
					</View>
				</GradientBackground>
			</SafeAreaView>
		);
	}

	// Add error state
	if (state.error) {
		return (
			<SafeAreaView style={styles.container}>
				<GradientBackground>
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>{state.error}</Text>
						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={styles.errorButton}>
							<Text style={styles.errorButtonText}>Go Back</Text>
						</TouchableOpacity>
					</View>
				</GradientBackground>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<GradientBackground>
				{/* Your existing header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.iconButton}>
						<ChevronDown color={colors.text.primary} size={24} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Now Playing</Text>
					<TouchableOpacity
						onPress={() => {}} // TODO: Implement share
						style={styles.iconButton}>
						<Share2 color={colors.text.primary} size={24} />
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.contentContainer}
					showsVerticalScrollIndicator={false}>
					{/* Your existing main content */}
					<View style={styles.mainContent}>
						{/* Cover Art */}
						<View style={styles.coverArt}>
							{state.currentBook.coverUrl ? (
								<Image
									source={{ uri: state.currentBook.coverUrl }}
									style={styles.coverImage}
								/>
							) : (
								<View style={styles.placeholderCover}>
									<Book color={colors.text.primary} size={64} />
								</View>
							)}
						</View>

						{/* Book Info */}
						<View style={styles.bookInfo}>
							<Text style={styles.title}>{state.currentBook.title}</Text>
							<Text style={styles.author}>{state.currentBook.author}</Text>
							{state.currentChapter && (
								<Text style={styles.chapter}>{state.currentChapter.title}</Text>
							)}
						</View>

						{/* Controls */}
						<View style={styles.actionButtons}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={() => setShowChapters(true)}>
								<List color={colors.text.primary} size={24} />
								<Text style={styles.actionText}>Chapters</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.actionButton,
									state.sleepTimer ? styles.actionButtonActive : null
								]}
								onPress={handleSleepTimer}>
								<Clock color={colors.text.primary} size={24} />
								<Text style={styles.actionText}>
									{state.sleepTimer ? `${state.sleepTimer}m` : 'Sleep'}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.actionButton}
								onPress={() => setShowSettings(true)}>
								<Settings color={colors.text.primary} size={24} />
								<Text style={styles.actionText}>Speed</Text>
							</TouchableOpacity>
						</View>

						<ProgressBar
							currentTime={state.currentTime}
							duration={state.duration}
							onSeek={seekTo}
						/>

						<PlayerControls
							isPlaying={state.isPlaying}
							onPlayPause={handlePlayPause}
							onSkipForward={skipForward} // Using skipForward
							onSkipBack={skipBackward} // Using skipBackward
						/>
					</View>
				</ScrollView>

				{/* Modals */}
				{(showChapters || showSettings || showSleepTimer) && (
					<Animated.View
						style={[
							styles.modalOverlay,
							{
								opacity: overlayAnimation.fadeAnim
							}
						]}>
						<TouchableOpacity
							style={styles.modalOverlayTouch}
							onPress={() => {
								setShowChapters(false);
								setShowSettings(false);
								setShowSleepTimer(false);
							}}
						/>
					</Animated.View>
				)}

				{showChapters && (
					<Animated.View
						style={[
							styles.modal,
							{
								transform: [
									{
										translateY: chaptersAnimation.translateY
									}
								]
							}
						]}>
						<GlassContainer style={styles.modalContent}>
							<View style={styles.modalHandle} />
							<ChapterList
								chapters={state.currentBook.chapters}
								currentTime={state.currentTime}
								onChapterPress={handleChapterPress}
							/>
						</GlassContainer>
					</Animated.View>
				)}

				{showSettings && (
					<Animated.View
						style={[
							styles.modal,
							{
								transform: [
									{
										translateY: settingsAnimation.translateY
									}
								]
							}
						]}>
						<GlassContainer style={styles.modalContent}>
							<View style={styles.modalHandle} />
							<PlaybackSettings
								playbackRate={state.playbackRate}
								onPlaybackRateChange={(rate) => {
									setPlaybackRate(rate);
									setShowSettings(false);
								}}
								onSleepTimerPress={handleSleepTimer}
							/>
						</GlassContainer>
					</Animated.View>
				)}

				{showSleepTimer && (
					<Animated.View
						style={[
							styles.modal,
							{
								transform: [
									{
										translateY: sleepTimerAnimation.translateY
									}
								]
							}
						]}>
						<GlassContainer style={styles.modalContent}>
							<View style={styles.modalHandle} />
							<SleepTimer
								onSetTimer={handleSetSleepTimer}
								onCancel={handleCancelSleepTimer}
								remainingTime={state.sleepTimer ? state.sleepTimer * 60 : null}
							/>
						</GlassContainer>
					</Animated.View>
				)}
			</GradientBackground>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	actionButtonActive: {
		backgroundColor: colors.glass.medium,
		borderRadius: 12,
		padding: spacing.sm
	},
	container: {
		flex: 1
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
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
	headerTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary
	},
	scrollView: {
		flex: 1
	},
	contentContainer: {
		flexGrow: 1,
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.xl
	},
	mainContent: {
		flex: 1,
		alignItems: 'center'
	},
	coverArt: {
		width: '80%',
		aspectRatio: 1,
		borderRadius: 24,
		overflow: 'hidden',
		marginVertical: spacing.xl
	},
	coverImage: {
		width: '100%',
		height: '100%'
	},
	placeholderCover: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bookInfo: {
		alignItems: 'center',
		marginBottom: spacing.lg,
		width: '100%'
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
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginBottom: spacing.xl
	},
	actionButton: {
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.xs
	},
	actionText: {
		color: colors.text.primary,
		fontSize: 12,
		marginTop: spacing.xs
	},
	modalOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	modalOverlayTouch: {
		flex: 1
	},
	modal: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		maxHeight: '80%'
	},
	modalContent: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: spacing.md
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.primary
	},
	modalHandle: {
		width: 40,
		height: 4,
		backgroundColor: colors.text.secondary,
		borderRadius: 2,
		alignSelf: 'center',
		marginBottom: spacing.md
	},
	closeButton: {
		padding: spacing.sm
	},
	chapterInfo: {
		marginTop: spacing.md,
		alignItems: 'center'
	},
	chapterTitle: {
		fontSize: 14,
		color: colors.text.primary,
		opacity: 0.8,
		textAlign: 'center'
	},
	chapterProgress: {
		fontSize: 12,
		color: colors.text.secondary,
		marginTop: spacing.xs
	},
	chapter: {
		// Add this missing style
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: spacing.xs,
		textAlign: 'center'
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.lg
	},
	errorText: {
		color: colors.text.primary,
		fontSize: 16,
		textAlign: 'center',
		marginBottom: spacing.md
	},
	errorButton: {
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		borderRadius: 8
	},
	errorButtonText: {
		color: colors.text.primary,
		fontSize: 16,
		fontWeight: '600'
	}
});

export default AudioPlayerScreen;
