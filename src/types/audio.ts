// API Response Types
export interface LibriVoxReader {
	reader_id: string;
	display_name: string;
}

export interface LibriVoxSection {
	id: string;
	section_number: string;
	title: string;
	listen_url: string;
	language: string;
	playtime: string;
	file_name: string | null;
	readers: LibriVoxReader[];
}

export interface LibriVoxGenre {
	id: string;
	name: string;
}

export interface LibriVoxBook {
	id: string;
	title: string;
	description?: string;
	language: string;
	copyright_year?: string;
	num_sections?: number;
	url_text_source?: string;
	totaltime?: string;
	totaltimesecs?: number;
	authors: Array<{
		id: number;
		first_name: string;
		last_name: string;
	}>;
	sections?: LibriVoxSection[];
	genres?: LibriVoxGenre[];
}

export interface LibriVoxResponse {
	books: LibriVoxBook[];
	pagination?: {
		page: number;
		total_pages: number;
		total_items: number;
	};
}

// App Types
export interface Chapter {
	id: string;
	title: string;
	startTime: number;
	duration: number;
	audioUrl: string;
	reader?: string;
}

export interface AudioBook {
	id: string;
	title: string;
	author: string;
	duration: number;
	audioUrl: string;
	coverUrl?: string;
	description?: string;
	language: string;
	genres: string[];
	source: 'librivox' | 'archive' | 'gutenberg';
	chapters: Chapter[];
	publishedDate?: string;
	downloadSize?: number;
	progress?: number;
}

export interface AudioBookFilter {
	genre?: string;
	language?: string;
	author?: string;
	query?: string;
	page?: number;
	limit?: number;
	sortBy?: 'title' | 'author' | 'recent';
}

export interface PlayerState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	playbackRate: number;
	isBuffering: boolean;
	currentChapter?: Chapter;
	currentBook?: AudioBook;
	error: string | null;
}
