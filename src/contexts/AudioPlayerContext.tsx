import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	Audio,
	InterruptionModeAndroid,
	InterruptionModeIOS,
	AVPlaybackStatus
} from 'expo-av';
import { AudioBook, Chapter, PlayerState } from '../types/audio';

interface AudioPlayerContextType {
	state: PlayerState;
	loadBook: (book: AudioBook) => Promise<void>;
	play: () => Promise<void>;
	pause: () => Promise<void>;
	seekTo: (position: number) => Promise<void>;
	playNextChapter: () => Promise<void>;
	playPreviousChapter: () => Promise<void>;
	skipForward: () => Promise<void>;
	skipBackward: () => Promise<void>;
	setPlaybackRate: (rate: number) => Promise<void>;
	navigateToChapter: (chapter: Chapter) => Promise<void>;
}

const initialState: PlayerState = {
	isPlaying: false,
	currentTime: 0,
	duration: 0,
	playbackRate: 1,
	isBuffering: false,
	currentBook: undefined,
	currentChapter: undefined,
	error: null
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
	undefined
);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [state, setState] = useState<PlayerState>(initialState);
	const soundRef = useRef<Audio.Sound | null>(null);
	const currentBookRef = useRef<AudioBook | null>(null);
	const currentChapterIndexRef = useRef<number>(0);
	const isMounted = useRef(true);
	const isTransitioning = useRef(false);

	useEffect(() => {
		setupAudio();
		return () => {
			isMounted.current = false;
			cleanup();
		};
	}, []);

	const safeSetState = (updater: (prev: PlayerState) => PlayerState) => {
		if (isMounted.current) {
			setState(updater);
		}
	};

	const setupAudio = async () => {
		try {
			await Audio.setAudioModeAsync({
				staysActiveInBackground: true,
				playsInSilentModeIOS: true,
				shouldDuckAndroid: true,
				playThroughEarpieceAndroid: false,
				interruptionModeIOS: InterruptionModeIOS.DuckOthers,
				interruptionModeAndroid: InterruptionModeAndroid.DuckOthers
			});
			await Audio.setIsEnabledAsync(true);
		} catch (error) {
			console.error('Error setting up audio:', error);
			safeSetState((prev) => ({ ...prev, error: 'Failed to setup audio' }));
		}
	};

	const cleanup = async () => {
		try {
			if (soundRef.current) {
				const status = await soundRef.current.getStatusAsync();
				if (status.isLoaded) {
					await soundRef.current.stopAsync();
					await soundRef.current.unloadAsync();
				}
				soundRef.current = null;
			}
			safeSetState((prev) => ({
				...prev,
				isPlaying: false,
				isBuffering: false
			}));
		} catch (error) {
			console.error('Error cleaning up audio:', error);
		}
	};

	const loadChapter = async (chapter: Chapter) => {
		if (isTransitioning.current) return;
		isTransitioning.current = true;

		try {
			await cleanup();
			safeSetState((prev) => ({ ...prev, isBuffering: true, error: null }));

			const { sound, status } = await Audio.Sound.createAsync(
				{ uri: chapter.audioUrl },
				{ shouldPlay: false, progressUpdateIntervalMillis: 500 },
				onPlaybackStatusUpdate
			);

			if (!isMounted.current) {
				await sound.unloadAsync();
				return;
			}

			soundRef.current = sound;
			safeSetState((prev) => ({
				...prev,
				isBuffering: false,
				currentChapter: chapter,
				duration: status.isLoaded ? status.durationMillis! / 1000 : 0
			}));
		} catch (error) {
			console.error('Error loading chapter:', error);
			safeSetState((prev) => ({
				...prev,
				isBuffering: false,
				error: 'Failed to load audio'
			}));
		} finally {
			isTransitioning.current = false;
		}
	};

	const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
		if (!status.isLoaded || !isMounted.current) return;

		safeSetState((prev) => ({
			...prev,
			isPlaying: status.isPlaying,
			currentTime: status.positionMillis / 1000,
			duration: status.durationMillis
				? status.durationMillis / 1000
				: prev.duration,
			isBuffering: status.isBuffering
		}));

		if (status.didJustFinish && !status.isLooping && !isTransitioning.current) {
			playNextChapter();
		}
	};

	// ... (previous code remains the same until onPlaybackStatusUpdate)

	const loadBook = async (book: AudioBook) => {
		if (!book || !book.chapters || book.chapters.length === 0) {
			throw new Error('Invalid book data');
		}

		try {
			currentBookRef.current = book;
			currentChapterIndexRef.current = 0;

			safeSetState((prev) => ({
				...prev,
				currentBook: book,
				error: null,
				isBuffering: true
			}));

			await loadChapter(book.chapters[0]);
		} catch (error) {
			console.error('Error loading book:', error);
			safeSetState((prev) => ({
				...prev,
				error: 'Failed to load book',
				isBuffering: false
			}));
			throw error;
		}
	};

	const play = async () => {
		try {
			if (soundRef.current && !isTransitioning.current) {
				const status = await soundRef.current.getStatusAsync();
				if (status.isLoaded) {
					await soundRef.current.playAsync();
					safeSetState((prev) => ({ ...prev, isPlaying: true }));
				} else {
					// Reload current chapter if sound is not loaded
					if (state.currentChapter) {
						await loadChapter(state.currentChapter);
						await soundRef.current?.playAsync();
					}
				}
			}
		} catch (error) {
			console.error('Error playing:', error);
			safeSetState((prev) => ({ ...prev, error: 'Failed to play audio' }));
		}
	};

	const pause = async () => {
		try {
			if (soundRef.current && !isTransitioning.current) {
				const status = await soundRef.current.getStatusAsync();
				if (status.isLoaded) {
					await soundRef.current.pauseAsync();
					safeSetState((prev) => ({ ...prev, isPlaying: false }));
				}
			}
		} catch (error) {
			console.error('Error pausing:', error);
			safeSetState((prev) => ({ ...prev, error: 'Failed to pause audio' }));
		}
	};

	const seekTo = async (position: number) => {
		try {
			if (soundRef.current && !isTransitioning.current) {
				const status = await soundRef.current.getStatusAsync();
				if (status.isLoaded) {
					await soundRef.current.setPositionAsync(position * 1000);
					safeSetState((prev) => ({ ...prev, currentTime: position }));
				} else if (state.currentChapter) {
					// Reload and seek if sound is not loaded
					await loadChapter(state.currentChapter);
					await soundRef.current?.setPositionAsync(position * 1000);
				}
			}
		} catch (error) {
			console.error('Error seeking:', error);
			safeSetState((prev) => ({ ...prev, error: 'Failed to seek' }));
		}
	};

	const playNextChapter = async () => {
		if (!currentBookRef.current || isTransitioning.current) return;

		try {
			const nextIndex = currentChapterIndexRef.current + 1;
			if (nextIndex < currentBookRef.current.chapters.length) {
				currentChapterIndexRef.current = nextIndex;
				const nextChapter = currentBookRef.current.chapters[nextIndex];
				await loadChapter(nextChapter);
				if (state.isPlaying) {
					await play();
				}
			} else {
				// End of book reached
				await pause();
				safeSetState((prev) => ({ ...prev, currentTime: 0 }));
			}
		} catch (error) {
			console.error('Error playing next chapter:', error);
			safeSetState((prev) => ({
				...prev,
				error: 'Failed to play next chapter'
			}));
		}
	};

	const playPreviousChapter = async () => {
		if (!currentBookRef.current || isTransitioning.current) return;

		try {
			const prevIndex = currentChapterIndexRef.current - 1;
			if (prevIndex >= 0) {
				currentChapterIndexRef.current = prevIndex;
				const prevChapter = currentBookRef.current.chapters[prevIndex];
				await loadChapter(prevChapter);
				if (state.isPlaying) {
					await play();
				}
			}
		} catch (error) {
			console.error('Error playing previous chapter:', error);
			safeSetState((prev) => ({
				...prev,
				error: 'Failed to play previous chapter'
			}));
		}
	};

	const skipForward = async () => {
		if (!soundRef.current || isTransitioning.current) return;

		try {
			const status = await soundRef.current.getStatusAsync();
			if (status.isLoaded) {
				const newPosition = status.positionMillis + 30000; // 30 seconds
				if (newPosition < status.durationMillis!) {
					await seekTo(newPosition / 1000);
				} else {
					await playNextChapter();
				}
			}
		} catch (error) {
			console.error('Error skipping forward:', error);
			safeSetState((prev) => ({ ...prev, error: 'Failed to skip forward' }));
		}
	};

	const skipBackward = async () => {
		if (!soundRef.current || isTransitioning.current) return;

		try {
			const status = await soundRef.current.getStatusAsync();
			if (status.isLoaded) {
				const newPosition = Math.max(0, status.positionMillis - 30000); // 30 seconds
				await seekTo(newPosition / 1000);
			}
		} catch (error) {
			console.error('Error skipping backward:', error);
			safeSetState((prev) => ({ ...prev, error: 'Failed to skip backward' }));
		}
	};

	const setPlaybackRate = async (rate: number) => {
		try {
			if (soundRef.current && !isTransitioning.current) {
				const status = await soundRef.current.getStatusAsync();
				if (status.isLoaded) {
					await soundRef.current.setRateAsync(rate, true);
					safeSetState((prev) => ({ ...prev, playbackRate: rate }));
				}
			}
		} catch (error) {
			console.error('Error setting playback rate:', error);
			safeSetState((prev) => ({
				...prev,
				error: 'Failed to set playback rate'
			}));
		}
	};

	const navigateToChapter = async (chapter: Chapter) => {
		if (!currentBookRef.current || isTransitioning.current) return;

		try {
			const chapterIndex = currentBookRef.current.chapters.findIndex(
				(c) => c.id === chapter.id
			);

			if (chapterIndex !== -1) {
				currentChapterIndexRef.current = chapterIndex;
				await loadChapter(chapter);
				await play();
			}
		} catch (error) {
			console.error('Error navigating to chapter:', error);
			safeSetState((prev) => ({
				...prev,
				error: 'Failed to navigate to chapter'
			}));
		}
	};

	const value = {
		state,
		loadBook,
		play,
		pause,
		seekTo,
		playNextChapter,
		playPreviousChapter,
		skipForward,
		skipBackward,
		setPlaybackRate,
		navigateToChapter
	};

	return (
		<AudioPlayerContext.Provider value={value}>
			{children}
		</AudioPlayerContext.Provider>
	);
};

export const useAudioPlayer = () => {
	const context = useContext(AudioPlayerContext);
	if (!context) {
		throw new Error(
			'useAudioPlayer must be used within an AudioPlayerProvider'
		);
	}
	return context;
};
