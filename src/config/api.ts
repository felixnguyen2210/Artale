import {
	LIBRIVOX_API_URL,
	GOOGLE_BOOKS_API_KEY,
	GOOGLE_BOOKS_API_URL
} from '@env';

export const API_CONFIG = {
	LIBRIVOX: {
		BASE_URL: LIBRIVOX_API_URL || 'https://librivox.org/api/feed/audiobooks',
		FORMAT: 'json'
	},
	GOOGLE_BOOKS: {
		BASE_URL: GOOGLE_BOOKS_API_URL,
		API_KEY: GOOGLE_BOOKS_API_KEY
	}
} as const;
