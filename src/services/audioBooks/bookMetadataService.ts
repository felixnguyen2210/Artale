import { libriVoxAPI } from '../api/librivox';
import { googleBooksAPI } from '../api/googleBooks';
import { AudioBook } from './types';

export const enrichBookMetadata = async (
	book: AudioBook
): Promise<AudioBook> => {
	try {
		// Try to get additional metadata from Google Books
		const googleBookInfo = await googleBooksAPI.getBookInfo(
			book.title,
			book.author
		);

		if (googleBookInfo) {
			return {
				...book,
				coverUrl:
					googleBookInfo.volumeInfo?.imageLinks?.thumbnail || book.coverUrl,
				description: googleBookInfo.volumeInfo?.description || book.description
				// Add any other metadata you want to enrich
			};
		}

		return book;
	} catch (error) {
		console.warn('Failed to enrich book metadata:', error);
		return book; // Return original book if enrichment fails
	}
};
