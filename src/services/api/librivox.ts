// src/api/librivox.ts
import { findBestMatch, extractBookMetadata } from './googleBooks';
import { LibriVoxBook, AudioBook } from '../../types/audio';
import { API_CONFIG } from '../../config/api';
import axios from 'axios';

export const enrichBookWithGoogleData = async (
	librivoxBook: LibriVoxBook
): Promise<AudioBook> => {
	try {
		// Create search query from LibriVox data
		const title = librivoxBook.title;
		const author = librivoxBook.authors?.[0]
			? `${librivoxBook.authors[0].first_name} ${librivoxBook.authors[0].last_name}`
			: undefined;

		// Get Google Books data
		const googleData = await findBestMatch(title, author);
		const googleMetadata = googleData ? extractBookMetadata(googleData) : null;

		// Combine LibriVox and Google Books data
		return {
			id: librivoxBook.id,
			title: librivoxBook.title,
			author: author || 'Unknown Author',
			duration: librivoxBook.totaltimesecs || 0,
			language: librivoxBook.language,
			source: 'librivox' as const,
			genres: (librivoxBook.genres || []).map((g) => g.name),
			chapters: (librivoxBook.sections || []).map((section, index) => ({
				id: section.id || `${librivoxBook.id}-${index}`,
				title: section.title || `Chapter ${index + 1}`,
				startTime: 0, // You'll need to calculate this based on previous chapters
				duration: parseInt(section.playtime || '0', 10),
				audioUrl: section.listen_url,
				reader: section.readers?.[0]?.display_name
			})),
			// Enhanced metadata from Google Books
			coverUrl: googleMetadata?.coverUrl || undefined,
			description: googleMetadata?.description || librivoxBook.description,
			publishedDate:
				googleMetadata?.publishedDate || librivoxBook.copyright_year,
			// Additional metadata
			publisher: googleMetadata?.publisher,
			rating: googleMetadata?.averageRating,
			ratingCount: googleMetadata?.ratingsCount,
			categories: googleMetadata?.categories || [],
			audioUrl: librivoxBook.sections?.[0]?.listen_url || ''
		};
	} catch (error) {
		console.error('Error enriching book data:', error);
		// Fallback to basic LibriVox data if Google Books enhancement fails
		return convertLibriVoxBook(librivoxBook);
	}
};

// Update your existing functions to use the enriched data
export const searchBooks = async (query: string): Promise<AudioBook[]> => {
	try {
		const response = await fetch(
			`${
				API_CONFIG.LIBRIVOX
			}/audiobooks?format=json&extended=1&search=${encodeURIComponent(query)}`
		);
		const data = await response.json();

		// Enrich each book with Google Books data
		const enrichedBooks = await Promise.all(
			data.books.map(async (book: LibriVoxBook) => {
				return await enrichBookWithGoogleData(book);
			})
		);

		return enrichedBooks;
	} catch (error) {
		console.error('Error searching books:', error);
		throw error;
	}
};

export const getBookById = async (id: string): Promise<AudioBook | null> => {
	try {
		const response = await axios.get(`${API_CONFIG.LIBRIVOX}`, {
			params: {
				format: 'json',
				extended: '1',
				id: id
			}
		});

		if (!response.data.books || response.data.books.length === 0) {
			return null;
		}

		return await enrichBookWithGoogleData(response.data.books[0]);
	} catch (error) {
		console.error('Error getting book by ID:', error);
		throw error;
	}
};

const convertLibriVoxBook = (book: LibriVoxBook): AudioBook => {
	return {
		id: book.id,
		title: book.title,
		author:
			book.authors?.map((a) => `${a.first_name} ${a.last_name}`).join(', ') ||
			'Unknown Author',
		duration: book.totaltimesecs || 0,
		language: book.language,
		genres: (book.genres || []).map((g) => g.name),
		source: 'librivox',
		description: book.description,
		publishedDate: book.copyright_year,
		chapters: (book.sections || []).map((section, index) => ({
			id: section.id || `${book.id}-${index}`,
			title: section.title || `Chapter ${index + 1}`,
			startTime: 0,
			duration: parseInt(section.playtime || '0', 10),
			audioUrl: section.listen_url,
			reader: section.readers?.[0]?.display_name
		})),
		audioUrl: book.sections?.[0]?.listen_url || ''
	};
};
