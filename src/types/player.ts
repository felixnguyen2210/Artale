import { Audio } from 'expo-av';
import { AudioBook } from './audio';

export interface PlayerState {
	isPlaying: boolean;
	isBuffering: boolean;
	currentTime: number;
	duration: number;
	currentBook: AudioBook | null;
	currentChapterIndex: number;
	playbackRate: number;
	error: string | null;
}

export interface PlayerContextType {
	state: PlayerState;
	loadBook: (book: AudioBook) => Promise<void>;
	play: () => Promise<void>;
	pause: () => Promise<void>;
	seekTo: (position: number) => Promise<void>;
	setPlaybackRate: (rate: number) => Promise<void>;
	skipToNextChapter: () => Promise<void>;
	skipToPreviousChapter: () => Promise<void>;
}
