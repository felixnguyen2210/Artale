export const API_CONFIG = {
	LIBRIVOX: {
		BASE_URL: 'https://librivox.org/api/feed/audiobooks',
		FORMAT: 'json'
	},
	GOOGLE_BOOKS: {
		BASE_URL: 'https://www.googleapis.com/books/v1',
		API_KEY: 'YOUR_GOOGLE_API_KEY' // You'll need to get this from Google Console
	}
};

export const DEFAULT_HEADERS = {
	'Content-Type': 'application/json'
};
