import axios from 'axios';
import {
	AudioBook,
	AudioBookFilter,
	LibriVoxResponse
} from '../../types/audio';
import { mapLibriVoxBookToAudioBook } from './mappers';

class AudioBookService {
	private api;

	constructor() {
		this.api = axios.create({
			baseURL: 'https://librivox.org/api/feed'
		});
	}

	async getBooks(filter: AudioBookFilter) {
		try {
			const params = {
				format: 'json',
				limit: filter.limit || 20,
				offset: filter.page ? (filter.page - 1) * (filter.limit || 20) : 0,
				extended: '1', // Get extended info including sections
				...(filter.query && { title: `^${filter.query}` })
			};

			const response = await this.api.get<LibriVoxResponse>('/audiobooks', {
				params
			});

			if (!response.data.books) {
				return {
					books: [],
					currentPage: 1,
					totalPages: 0
				};
			}

			// Map LibriVox books to our AudioBook type
			const validBooks = response.data.books
				.filter((book) => book.sections && book.sections.length > 0) // Only books with sections
				.map((book) => {
					try {
						return mapLibriVoxBookToAudioBook(book);
					} catch (error) {
						console.error(`Error mapping book ${book.id}:`, error);
						return null;
					}
				})
				.filter((book): book is AudioBook => book !== null); // Type guard to remove null books

			return {
				books: validBooks,
				currentPage: filter.page || 1,
				totalPages: Math.ceil(
					(response.data.pagination?.total_items || 0) / (filter.limit || 20)
				)
			};
		} catch (error) {
			console.error('Error fetching books:', error);
			return {
				books: [],
				currentPage: 1,
				totalPages: 0
			};
		}
	}

	async getBookById(id: string): Promise<AudioBook> {
		try {
			const response = await this.api.get<LibriVoxResponse>('/audiobooks', {
				params: {
					id,
					format: 'json',
					extended: '1'
				}
			});

			if (!response.data.books || response.data.books.length === 0) {
				throw new Error('Book not found');
			}

			const book = response.data.books[0];

			if (!book.sections || book.sections.length === 0) {
				throw new Error('Book has no audio sections');
			}

			return mapLibriVoxBookToAudioBook(book);
		} catch (error) {
			console.error(`Error fetching book ${id}:`, error);
			throw error;
		}
	}

	private handleError(error: unknown): Error {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return new Error(
					`API Error: ${error.response.status} - ${
						error.response.data?.message || 'Unknown error'
					}`
				);
			} else if (error.request) {
				return new Error('Network Error: No response from server');
			}
		}
		return new Error('An unexpected error occurred');
	}
}

export const audioBookService = new AudioBookService();
