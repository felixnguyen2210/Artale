import { LibriVoxBook, AudioBook, Chapter } from './types';

export const mapLibriVoxBookToAudioBook = (book: LibriVoxBook): AudioBook => {
	const chapters: Chapter[] =
		book.sections?.map((section) => ({
			id: section.id.toString(),
			title: section.title,
			startTime: 0, // LibriVox doesn't provide start times
			duration: parseInt(section.playtime) || 0,
			audioUrl: section.listen_url
		})) || [];

	return {
		id: book.id,
		title: book.title,
		author: book.authors
			.map((author) => `${author.first_name} ${author.last_name}`.trim())
			.join(', '),
		duration: book.totaltimesecs || 0,
		language: book.language,
		description: book.description,
		genres: [], // LibriVox doesn't provide genres directly
		source: 'librivox',
		audioUrl: chapters[0]?.audioUrl || '',
		chapters,
		publishedDate: book.copyright_year
	};
};
