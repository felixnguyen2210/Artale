import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../../config/api';

class GoogleBooksAPI {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: API_CONFIG.GOOGLE_BOOKS.BASE_URL,
			params: {
				key: API_CONFIG.GOOGLE_BOOKS.API_KEY
			}
		});
	}

	async getBookInfo(title: string, author?: string): Promise<any> {
		try {
			const query = author
				? `intitle:${title}+inauthor:${author}`
				: `intitle:${title}`;

			const response = await this.api.get('/volumes', {
				params: {
					q: query,
					maxResults: 1
				}
			});

			return response.data.items?.[0] || null;
		} catch (error) {
			console.error('Google Books API Error:', error);
			throw this.handleError(error);
		}
	}

	private handleError(error: any): Error {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return new Error(
					`Google Books API Error: ${error.response.status} - ${
						error.response.data?.message || 'Unknown error'
					}`
				);
			} else if (error.request) {
				return new Error('Network Error: No response from Google Books API');
			}
		}
		return new Error(
			'Unknown Error occurred while fetching from Google Books API'
		);
	}
}

export const googleBooksAPI = new GoogleBooksAPI();
