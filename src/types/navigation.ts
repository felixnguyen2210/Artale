import { AudioBook } from './audio';

export type RootStackParamList = {
	MainTabs: undefined;
	AudioPlayer: {
		book: AudioBook;
	};
	BookDetails: { book: AudioBook };
	Home: undefined;
};

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
