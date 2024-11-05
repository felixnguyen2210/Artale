import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../../config/api';
import { LibriVoxResponse, AudioBookFilter } from '../audioBooks/types';

class LibriVoxAPI {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: API_CONFIG.LIBRIVOX.BASE_URL,
			params: {
				format: API_CONFIG.LIBRIVOX.FORMAT
			}
		});
	}

	async getBooks(filter: AudioBookFilter): Promise<LibriVoxResponse> {
		try {
			const params = {
				limit: filter.limit || 20,
				offset: filter.page ? (filter.page - 1) * (filter.limit || 20) : 0,
				author: filter.author,
				title: filter.query,
				extended: 1 // Get extended book information
			};

			const response = await this.api.get('/', { params });
			return response.data;
		} catch (error) {
			console.error('LibriVox API Error:', error);
			throw this.handleError(error);
		}
	}

	async getBookById(id: string): Promise<LibriVoxResponse> {
		try {
			const params = {
				id,
				extended: 1
			};

			const response = await this.api.get('/', { params });
			return response.data;
		} catch (error) {
			console.error('LibriVox API Error:', error);
			throw this.handleError(error);
		}
	}

	private handleError(error: any): Error {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				return new Error(
					`LibriVox API Error: ${error.response.status} - ${
						error.response.data?.message || 'Unknown error'
					}`
				);
			} else if (error.request) {
				return new Error('Network Error: No response from LibriVox API');
			}
		}
		return new Error('Unknown Error occurred while fetching from LibriVox API');
	}
}

// Create a single instance to be used throughout the app
export const libriVoxAPI = new LibriVoxAPI();
