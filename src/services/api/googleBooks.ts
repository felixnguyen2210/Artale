// src/services/api/googleBooks.ts
import axios from 'axios';
import { API_CONFIG } from '../../config/api';

interface GoogleBookMetadata {
	id: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		publisher?: string;
		publishedDate?: string;
		description?: string;
		pageCount?: number;
		categories?: string[];
		averageRating?: number;
		ratingsCount?: number;
		imageLinks?: {
			thumbnail?: string;
			smallThumbnail?: string;
			small?: string;
			medium?: string;
			large?: string;
			extraLarge?: string;
		};
		language?: string;
		industryIdentifiers?: Array<{
			type: 'ISBN_10' | 'ISBN_13' | 'OTHER';
			identifier: string;
		}>;
	};
}

interface GoogleBookSearchParams {
	q: string;
	langRestrict?: string;
	maxResults?: number;
	orderBy?: 'relevance' | 'newest';
	printType?: 'all' | 'books' | 'magazines';
}

export const searchGoogleBooks = async (
	query: string,
	options: Partial<GoogleBookSearchParams> = {}
): Promise<GoogleBookMetadata[]> => {
	try {
		const response = await axios.get(
			`${API_CONFIG.GOOGLE_BOOKS.BASE_URL}/volumes`,
			{
				params: {
					q: query,
					maxResults: options.maxResults || 10,
					langRestrict: options.langRestrict,
					orderBy: options.orderBy || 'relevance',
					printType: options.printType || 'books'
				}
			}
		);

		return response.data.items || [];
	} catch (error) {
		console.error('Error searching Google Books:', error);
		throw error;
	}
};

export const getBookByISBN = async (
	isbn: string
): Promise<GoogleBookMetadata | null> => {
	try {
		const response = await searchGoogleBooks(`isbn:${isbn}`);
		return response[0] || null;
	} catch (error) {
		console.error('Error fetching book by ISBN:', error);
		throw error;
	}
};

export const findBestMatch = async (
	title: string,
	author?: string
): Promise<GoogleBookMetadata | null> => {
	try {
		// Create a more specific search query
		let query = `intitle:"${title}"`;
		if (author) {
			query += ` inauthor:"${author}"`;
		}

		const response = await searchGoogleBooks(query, {
			maxResults: 5,
			orderBy: 'relevance'
		});

		if (!response.length) return null;

		// Find best match based on title similarity
		return response.reduce((best, current) => {
			const currentSimilarity = calculateTitleSimilarity(
				title,
				current.volumeInfo.title
			);
			const bestSimilarity = calculateTitleSimilarity(
				title,
				best.volumeInfo.title
			);

			return currentSimilarity > bestSimilarity ? current : best;
		});
	} catch (error) {
		console.error('Error finding best match:', error);
		throw error;
	}
};

// Helper to get high resolution cover image URL
export const getHighResCoverUrl = (
	imageLinks?: GoogleBookMetadata['volumeInfo']['imageLinks']
): string | undefined => {
	if (!imageLinks) return undefined;

	// Try to get the highest resolution available
	return (
		imageLinks.extraLarge ||
		imageLinks.large ||
		imageLinks.medium ||
		imageLinks.small ||
		imageLinks.thumbnail ||
		imageLinks.smallThumbnail
	);
};

// Helper to calculate similarity between two strings
const calculateTitleSimilarity = (str1: string, str2: string): number => {
	const s1 = str1.toLowerCase();
	const s2 = str2.toLowerCase();

	let matches = 0;
	const wordSet = new Set(s1.split(/\s+/));
	s2.split(/\s+/).forEach((word) => {
		if (wordSet.has(word)) matches++;
	});

	return matches / Math.max(s1.split(/\s+/).length, s2.split(/\s+/).length);
};

export const extractBookMetadata = (book: GoogleBookMetadata) => {
	const { volumeInfo } = book;

	return {
		googleBooksId: book.id,
		title: volumeInfo.title,
		authors: volumeInfo.authors || [],
		publisher: volumeInfo.publisher,
		publishedDate: volumeInfo.publishedDate,
		description: volumeInfo.description,
		pageCount: volumeInfo.pageCount,
		categories: volumeInfo.categories || [],
		averageRating: volumeInfo.averageRating,
		ratingsCount: volumeInfo.ratingsCount,
		coverUrl: getHighResCoverUrl(volumeInfo.imageLinks),
		language: volumeInfo.language,
		isbn: volumeInfo.industryIdentifiers?.find(
			(id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
		)?.identifier
	};
};
