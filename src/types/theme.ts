export type MediaType = 'audio' | 'ebook' | 'movie' | 'art';

export interface ContentItem {
	id: string;
	title: string;
	creator: string;
	coverUrl?: string;
	mediaType: MediaType;
	addedDate: Date;
	duration?: number; // for audio/video
	fileSize: number;
	progress?: number;
}

export interface Collection {
	id: string;
	name: string;
	mediaType: MediaType[];
	itemCount: number;
	color: string;
}
