import axios from 'axios';
import {
	AudioBook,
	AudioBookFilter,
	LibriVoxResponse,
	LibriVoxBook
} from './types';
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
			const searchTerm = filter.query?.trim();

			const params = {
				format: 'json',
				limit: filter.limit || 20,
				offset: filter.page ? (filter.page - 1) * (filter.limit || 20) : 0,
				...(searchTerm && { title: `^${searchTerm}` })
			};

			const response = await this.api.get<LibriVoxResponse>('/audiobooks', {
				params
			});

			if (response.data.books && Array.isArray(response.data.books)) {
				const validBooks = response.data.books
					.filter((book) => book?.title)
					.map(mapLibriVoxBookToAudioBook);

				return {
					books: validBooks,
					currentPage: filter.page || 1,
					totalPages: Math.ceil(validBooks.length / (filter.limit || 20))
				};
			}

			return {
				books: [],
				currentPage: 1,
				totalPages: 0
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
}

export const audioBookService = new AudioBookService();
