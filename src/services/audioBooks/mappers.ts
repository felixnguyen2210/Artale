import {
	LibriVoxBook,
	LibriVoxSection,
	AudioBook,
	Chapter
} from '../../types/audio';

const convertPlaytimeToSeconds = (playtime: string): number => {
	// LibriVox provides playtime in seconds as string
	return parseInt(playtime) || 0;
};

const mapSectionToChapter = (section: LibriVoxSection): Chapter => {
	return {
		id: section.id,
		title: section.title,
		startTime: 0, // Will be calculated in the book mapper
		duration: convertPlaytimeToSeconds(section.playtime),
		audioUrl: section.listen_url,
		reader: section.readers[0]?.display_name
	};
};

export const mapLibriVoxBookToAudioBook = (book: LibriVoxBook): AudioBook => {
	if (!book.sections) {
		throw new Error('Book has no sections');
	}

	// Map chapters with calculated start times
	const chapters: Chapter[] = book.sections.map((section, index, sections) => {
		const chapter = mapSectionToChapter(section);

		// Calculate start time based on sum of previous chapters' durations
		chapter.startTime = sections
			.slice(0, index)
			.reduce(
				(total, prevSection) =>
					total + convertPlaytimeToSeconds(prevSection.playtime),
				0
			);

		return chapter;
	});

	// Get author names
	const authorName = book.authors
		.map((author) => `${author.first_name} ${author.last_name}`.trim())
		.join(', ');

	// Get genres if available
	const genres = book.genres?.map((genre) => genre.name) || [];

	return {
		id: book.id,
		title: book.title,
		author: authorName,
		duration: book.totaltimesecs || 0,
		audioUrl: chapters[0]?.audioUrl || '', // First chapter's audio URL
		description: book.description || '',
		language: book.language,
		genres: genres,
		source: 'librivox',
		chapters: chapters,
		publishedDate: book.copyright_year,
		downloadSize: 0, // LibriVox doesn't provide this
		progress: 0 // Initialize at 0
	};
};
