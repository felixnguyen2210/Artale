export interface PlayerState {
	isPlaying: boolean;
	currentTime: number; // in seconds
	duration: number; // in seconds
	playbackRate: number;
	isBuffering: boolean;
	currentChapter?: Chapter;
}

export interface Chapter {
	id: string;
	title: string;
	duration: number; // in seconds
	startTime: number; // in seconds
}

export interface AudioBook {
	id: string;
	title: string;
	author: string;
	duration: number; // in seconds
	coverUrl?: string;
	audioUrl: string;
	chapters: Chapter[];
	progress: number; // percentage
	lastPlayedAt?: Date;
}
