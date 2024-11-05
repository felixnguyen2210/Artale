export interface AudioBook {
	id: string;
	title: string;
	author: string;
	duration: number;
	coverUrl?: string;
	description?: string;
	language: string;
	genres: string[];
	source: 'librivox' | 'archive' | 'gutenberg';
	audioUrl: string;
	chapters: Chapter[];
	publishedDate?: string;
	downloadSize?: number;
	rating?: number;
	totalRatings?: number;
}

export interface Chapter {
	id: string;
	title: string;
	startTime: number;
	duration: number;
	audioUrl: string;
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

// LibriVox specific types
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
	sections?: Array<{
		id: number;
		title: string;
		playtime: string;
		listen_url: string;
	}>;
}

export interface LibriVoxResponse {
	books: LibriVoxBook[];
	pagination?: {
		page: number;
		total_pages: number;
		total_items: number;
	};
}
