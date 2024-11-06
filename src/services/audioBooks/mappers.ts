import { LibriVoxBook, AudioBook, Chapter } from './types';

export const mapLibriVoxBookToAudioBook = (book: LibriVoxBook): AudioBook => {
	// Map chapters
	const chapters: Chapter[] =
		book.sections?.map((section) => ({
			id: section.id.toString(),
			title: section.title,
			startTime: 0,
			duration: parseInt(section.playtime) || 0,
			audioUrl: section.listen_url
		})) || [];

	// Format author name
	const authorName = book.authors
		.map((author) => `${author.first_name} ${author.last_name}`.trim())
		.join(', ');

	return {
		id: book.id,
		title: book.title,
		author: authorName,
		duration: book.totaltimesecs || 0,
		audioUrl: chapters[0]?.audioUrl || '', // Added the required audioUrl
		description: book.description,
		language: book.language,
		genres: [],
		source: 'librivox',
		chapters,
		publishedDate: book.copyright_year,
		downloadSize: 0,
		coverUrl: undefined
	};
};
