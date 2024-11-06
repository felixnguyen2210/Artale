import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { AudioBook, Chapter, PlayerState } from '../types/audio';

interface AudioPlayerContextType {
	state: PlayerState;
	loadBook: (book: AudioBook) => Promise<void>;
	play: () => Promise<void>;
	pause: () => Promise<void>;
	seekTo: (position: number) => Promise<void>;
	playNextChapter: () => Promise<void>;
	playPreviousChapter: () => Promise<void>;
	skipForward: () => Promise<void>; // For 30sec skip
	skipBackward: () => Promise<void>; // For 30sec skip
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
	currentChapter: undefined
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

	useEffect(() => {
		setupAudio();
		return () => {
			if (soundRef.current) {
				soundRef.current.unloadAsync(); // Don't await in cleanup
			}
		};
	}, []);

	const setupAudio = async () => {
		try {
			await Audio.setAudioModeAsync({
				staysActiveInBackground: true,
				playsInSilentModeIOS: true,
				shouldDuckAndroid: true,
				playThroughEarpieceAndroid: false
			});
		} catch (error) {
			console.error('Error setting up audio:', error);
		}
	};

	const cleanup = async () => {
		if (soundRef.current) {
			await soundRef.current.unloadAsync();
		}
	};

	const loadChapter = async (chapter: Chapter) => {
		try {
			if (soundRef.current) {
				await soundRef.current.unloadAsync();
			}

			setState((prev) => ({ ...prev, isBuffering: true }));

			// Find and update current chapter index
			if (currentBookRef.current) {
				const chapterIndex = currentBookRef.current.chapters.findIndex(
					(c) => c.id === chapter.id
				);
				if (chapterIndex !== -1) {
					currentChapterIndexRef.current = chapterIndex;
				}
			}

			const { sound, status } = await Audio.Sound.createAsync(
				{ uri: chapter.audioUrl },
				{ shouldPlay: false, progressUpdateIntervalMillis: 1000 },
				onPlaybackStatusUpdate
			);

			soundRef.current = sound;

			setState((prev) => ({
				...prev,
				isBuffering: false,
				currentChapter: chapter,
				duration: status.isLoaded ? status.durationMillis! / 1000 : 0
			}));
		} catch (error) {
			console.error('Error loading chapter:', error);
			setState((prev) => ({ ...prev, isBuffering: false }));
		}
	};

	const navigateToChapter = async (chapter: Chapter) => {
		try {
			if (!currentBookRef.current) return;

			await loadChapter(chapter);
			await play(); // Auto-play when navigating to a new chapter
		} catch (error) {
			console.error('Error navigating to chapter:', error);
		}
	};

	const loadBook = async (book: AudioBook) => {
		currentBookRef.current = book;
		currentChapterIndexRef.current = 0;
		setState((prev) => ({
			...prev,
			currentBook: book // Add this line
		}));
		await loadChapter(book.chapters[0]);
	};

	const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
		if (!status.isLoaded) return;

		setState((prev) => ({
			...prev,
			isPlaying: status.isPlaying,
			currentTime: status.positionMillis / 1000,
			duration: status.durationMillis ? status.durationMillis / 1000 : 0,
			isBuffering: status.isBuffering
		}));

		// Auto-play next chapter when current one ends
		if (status.didJustFinish) {
			playNextChapter();
		}
	};

	const play = async () => {
		try {
			if (soundRef.current) {
				await soundRef.current.playAsync();
			}
		} catch (error) {
			console.error('Error playing:', error);
		}
	};

	const pause = async () => {
		try {
			if (soundRef.current) {
				await soundRef.current.pauseAsync();
			}
		} catch (error) {
			console.error('Error pausing:', error);
		}
	};

	const seekTo = async (position: number) => {
		try {
			if (soundRef.current) {
				await soundRef.current.setPositionAsync(position * 1000);
			}
		} catch (error) {
			console.error('Error seeking:', error);
		}
	};

	const playNextChapter = async () => {
		if (!currentBookRef.current) return;

		const nextIndex = currentChapterIndexRef.current + 1;
		if (nextIndex < currentBookRef.current.chapters.length) {
			currentChapterIndexRef.current = nextIndex;
			await loadChapter(currentBookRef.current.chapters[nextIndex]);
			await play();
		}
	};

	const playPreviousChapter = async () => {
		if (!currentBookRef.current) return;

		const prevIndex = currentChapterIndexRef.current - 1;
		if (prevIndex >= 0) {
			currentChapterIndexRef.current = prevIndex;
			await loadChapter(currentBookRef.current.chapters[prevIndex]);
			await play();
		}
	};

	const skipForward = async () => {
		if (soundRef.current) {
			const status = await soundRef.current.getStatusAsync();
			if (status.isLoaded) {
				const newPosition = status.positionMillis + 30000; // 30 seconds
				await seekTo(newPosition / 1000);
			}
		}
	};

	const skipBackward = async () => {
		if (soundRef.current) {
			const status = await soundRef.current.getStatusAsync();
			if (status.isLoaded) {
				const newPosition = Math.max(0, status.positionMillis - 30000); // 30 seconds
				await seekTo(newPosition / 1000);
			}
		}
	};

	const setPlaybackRate = async (rate: number) => {
		try {
			if (soundRef.current) {
				await soundRef.current.setRateAsync(rate, true);
				setState((prev) => ({ ...prev, playbackRate: rate }));
			}
		} catch (error) {
			console.error('Error setting playback rate:', error);
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
