import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { audioBookService } from '../services/audioBooks/audioBookService';
import { AudioBook, AudioBookFilter } from '../services/audioBooks/types';

type AudioBooksResponse = {
	books: AudioBook[];
	totalPages: number;
	currentPage: number;
};

export const useAudioBooks = (
	filter: AudioBookFilter,
	options?: Omit<
		UseQueryOptions<AudioBooksResponse, Error>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery({
		queryKey: ['audioBooks', filter],
		queryFn: () => audioBookService.getBooks(filter),
		...options
	});
};

export const useAudioBook = (
	id: string,
	options?: Omit<UseQueryOptions<AudioBook, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: ['audioBook', id],
		queryFn: () => audioBookService.getBookById(id),
		...options
	});
};
