// src/types/navigation.ts
import { AudioBook } from './audio';

export type RootStackParamList = {
	LibraryScreen: undefined;
	BookDetails: {
		book: AudioBook;
	};
	AudioPlayer: {
		book: AudioBook;
	};
};
