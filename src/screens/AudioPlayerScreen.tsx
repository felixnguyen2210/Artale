import React, { useState } from 'react';
import {
	Animated,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView
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
import { useNavigation } from '@react-navigation/native';
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

const AudioPlayerScreen = () => {
	const navigation = useNavigation();
	const {
		state,
		play,
		pause,
		seekTo,
		setPlaybackRate,
		skipForward,
		skipBackward,
		navigateToChapter
	} = useAudioPlayer();

	const [showChapters, setShowChapters] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	const chaptersAnimation = useSlideAnimation(showChapters);
	const settingsAnimation = useSlideAnimation(showSettings);
	const overlayAnimation = useSlideAnimation(showChapters || showSettings);

	const handlePlayPause = async () => {
		if (state.isPlaying) {
			await pause();
		} else {
			await play();
		}
	};

	const handleSleepTimer = () => {
		// TODO: Implement sleep timer
		console.log('Sleep timer pressed');
	};

	const handleChapterPress = async (chapter: Chapter) => {
		await navigateToChapter(chapter);
		setShowChapters(false);
	};

	if (!state.currentBook) return null;

	return (
		<SafeAreaView style={styles.container}>
			<GradientBackground>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.iconButton}>
						<ChevronDown color={colors.text.primary} size={24} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Now Playing</Text>
					<TouchableOpacity
						onPress={() => console.log('Share')}
						style={styles.iconButton}>
						<Share2 color={colors.text.primary} size={24} />
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.contentContainer}
					showsVerticalScrollIndicator={false}>
					<View style={styles.mainContent}>
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

						<View style={styles.bookInfo}>
							<Text style={styles.title}>{state.currentBook.title}</Text>
							<Text style={styles.author}>{state.currentBook.author}</Text>
							{state.currentChapter && (
								<View style={styles.chapterInfo}>
									<Text style={styles.chapterTitle}>
										{state.currentChapter.title}
									</Text>
								</View>
							)}
						</View>

						<View style={styles.actionButtons}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={() => setShowChapters(true)}>
								<List color={colors.text.primary} size={24} />
								<Text style={styles.actionText}>Chapters</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleSleepTimer}>
								<Clock color={colors.text.primary} size={24} />
								<Text style={styles.actionText}>Sleep</Text>
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
							onSkipForward={skipForward}
							onSkipBack={skipBackward}
						/>
					</View>
				</ScrollView>

				{/* Modals */}
				{(showChapters || showSettings) && (
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
	}
});

export default AudioPlayerScreen;
