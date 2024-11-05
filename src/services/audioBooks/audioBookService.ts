import { libriVoxAPI } from '../api/librivox';
import { mapLibriVoxBookToAudioBook } from './mappers';
import { AudioBook, AudioBookFilter } from './types';

class AudioBookService {
	async getBooks(filter: AudioBookFilter): Promise<{
		books: AudioBook[];
		totalPages: number;
		currentPage: number;
	}> {
		try {
			const response = await libriVoxAPI.getBooks(filter);

			const books = response.books.map(mapLibriVoxBookToAudioBook);

			return {
				books,
				totalPages: response.pagination?.total_pages || 1,
				currentPage: response.pagination?.page || 1
			};
		} catch (error) {
			console.error('Error fetching audio books:', error);
			throw error;
		}
	}

	async getBookById(id: string): Promise<AudioBook> {
		try {
			const response = await libriVoxAPI.getBookById(id);
			if (!response.books || response.books.length === 0) {
				throw new Error('Book not found');
			}

			return mapLibriVoxBookToAudioBook(response.books[0]);
		} catch (error) {
			console.error('Error fetching audio book:', error);
			throw error;
		}
	}
}

export const audioBookService = new AudioBookService();
