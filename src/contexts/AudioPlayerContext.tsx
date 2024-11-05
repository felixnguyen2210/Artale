import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { AudioBook, PlayerState } from '../types/audio';

// Test audio book data
const TEST_BOOK: AudioBook = {
	id: '1',
	title: 'Project Hail Mary',
	author: 'Andy Weir',
	duration: 1800,
	audioUrl:
		'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
	chapters: [
		{
			id: '1',
			title: 'Introduction',
			duration: 300,
			startTime: 0
		},
		{
			id: '2',
			title: 'Chapter 1: Awakening',
			duration: 600,
			startTime: 300
		},
		{
			id: '3',
			title: 'Chapter 2: Discovery',
			duration: 900,
			startTime: 900
		}
	],
	progress: 0
};

interface AudioPlayerContextType {
	playerState: PlayerState;
	currentBook?: AudioBook;
	loadBook: (book: AudioBook) => Promise<void>;
	playPause: () => Promise<void>;
	seek: (time: number) => Promise<void>;
	setPlaybackRate: (rate: number) => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
	undefined
);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
	const { playerState, loadAudio, playPause, seek, setPlaybackRate } =
		useAudioPlayer();

	const [currentBook, setCurrentBook] = React.useState<AudioBook>();

	// Load test book on mount
	useEffect(() => {
		loadBook(TEST_BOOK);
	}, []);

	const loadBook = async (book: AudioBook) => {
		setCurrentBook(book);
		await loadAudio(book.audioUrl);
	};

	const value = {
		playerState,
		currentBook,
		loadBook,
		playPause,
		seek,
		setPlaybackRate
	};

	return (
		<AudioPlayerContext.Provider value={value}>
			{children}
		</AudioPlayerContext.Provider>
	);
};

export const useAudioPlayerContext = () => {
	const context = useContext(AudioPlayerContext);
	if (context === undefined) {
		throw new Error(
			'useAudioPlayerContext must be used within a AudioPlayerProvider'
		);
	}
	return context;
};
