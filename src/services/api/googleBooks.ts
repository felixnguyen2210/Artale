// src/services/api/googleBooks.ts
import axios from 'axios';
import { API_CONFIG } from '../../config/api';

interface GoogleBookInfo {
	title: string;
	authors?: string[];
	description?: string;
	categories?: string[];
	imageLinks?: {
		thumbnail?: string;
		smallThumbnail?: string;
	};
	publishedDate?: string;
	averageRating?: number;
	ratingsCount?: number;
}

class GoogleBooksAPI {
	private api;

	constructor() {
		this.api = axios.create({
			baseURL: API_CONFIG.GOOGLE_BOOKS.BASE_URL
		});
	}

	async getBookInfo(
		title: string,
		author?: string
	): Promise<GoogleBookInfo | null> {
		try {
			const query = author
				? `intitle:"${title}"+inauthor:"${author}"`
				: `intitle:"${title}"`;

			const response = await this.api.get('/volumes', {
				params: {
					q: query,
					key: API_CONFIG.GOOGLE_BOOKS.API_KEY,
					maxResults: 1
				}
			});

			if (response.data.items?.[0]?.volumeInfo) {
				return response.data.items[0].volumeInfo;
			}

			return null;
		} catch (error) {
			console.error('Error fetching Google Books data:', error);
			return null;
		}
	}
}

export const googleBooksAPI = new GoogleBooksAPI();
