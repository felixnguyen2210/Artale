import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	Audio,
	InterruptionModeIOS,
	InterruptionModeAndroid,
	AVPlaybackStatus
} from 'expo-av';
import { AudioBook } from '../types/audio';
import { PlayerState, PlayerContextType } from '../types/player';

const initialPlayerState: PlayerState = {
	isPlaying: false,
	isBuffering: false,
	currentTime: 0,
	duration: 0,
	currentBook: null,
	currentChapterIndex: 0,
	playbackRate: 1,
	error: null
};

const AudioPlayerContext = createContext<PlayerContextType | undefined>(
	undefined
);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [state, setState] = useState<PlayerState>(initialPlayerState);
	const soundRef = useRef<Audio.Sound | null>(null);

	// Set up audio session on mount
	useEffect(() => {
		const setupAudio = async () => {
			try {
				await Audio.setAudioModeAsync({
					staysActiveInBackground: true,
					interruptionModeIOS: InterruptionModeIOS.DuckOthers,
					playsInSilentModeIOS: true,
					shouldDuckAndroid: true,
					interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
					playThroughEarpieceAndroid: false
				});
			} catch (error) {
				console.error('Error setting up audio mode:', error);
			}
		};

		setupAudio();

		// Cleanup on unmount
		return () => {
			if (soundRef.current) {
				soundRef.current.unloadAsync();
			}
		};
	}, []);

	const loadBook = async (book: AudioBook) => {
		try {
			// Unload current audio if exists
			if (soundRef.current) {
				await soundRef.current.unloadAsync();
			}

			setState((prev) => ({
				...prev,
				isBuffering: true,
				currentBook: book,
				currentChapterIndex: 0,
				error: null
			}));

			// Now using the correct audioUrl property
			const { sound } = await Audio.Sound.createAsync(
				{ uri: book.audioUrl },
				{ shouldPlay: false, progressUpdateIntervalMillis: 1000 },
				onPlaybackStatusUpdate
			);

			soundRef.current = sound;

			setState((prev) => ({
				...prev,
				isBuffering: false
			}));
		} catch (error) {
			console.error('Error loading book:', error);
			setState((prev) => ({
				...prev,
				isBuffering: false,
				error: 'Failed to load audio'
			}));
		}
	};

	const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
		if (!status.isLoaded) return;

		setState((prev) => ({
			...prev,
			isPlaying: status.isPlaying,
			isBuffering: status.isBuffering,
			currentTime: status.positionMillis / 1000,
			duration: status.durationMillis ? status.durationMillis / 1000 : 0,
			playbackRate: status.rate
		}));
	};

	const play = async () => {
		try {
			if (!soundRef.current) return;
			await soundRef.current.playAsync();
		} catch (error) {
			console.error('Error playing audio:', error);
		}
	};

	const pause = async () => {
		try {
			if (!soundRef.current) return;
			await soundRef.current.pauseAsync();
		} catch (error) {
			console.error('Error pausing audio:', error);
		}
	};

	const seekTo = async (position: number) => {
		try {
			if (!soundRef.current) return;
			await soundRef.current.setPositionAsync(position * 1000);
		} catch (error) {
			console.error('Error seeking audio:', error);
		}
	};

	const setPlaybackRate = async (rate: number) => {
		try {
			if (!soundRef.current) return;
			await soundRef.current.setRateAsync(rate, true);
		} catch (error) {
			console.error('Error setting playback rate:', error);
		}
	};

	const value: PlayerContextType = {
		state,
		loadBook,
		play,
		pause,
		seekTo,
		setPlaybackRate,
		skipToNextChapter: async () => {}, // We'll implement these later
		skipToPreviousChapter: async () => {} // We'll implement these later
	};

	return (
		<AudioPlayerContext.Provider value={value}>
			{children}
		</AudioPlayerContext.Provider>
	);
};

export const useAudioPlayer = () => {
	const context = useContext(AudioPlayerContext);
	if (context === undefined) {
		throw new Error(
			'useAudioPlayer must be used within an AudioPlayerProvider'
		);
	}
	return context;
};
