import { AudioBook } from './audio';

export type RootStackParamList = {
	MainTabs: undefined;
	AudioPlayer: undefined;
	BookDetails: { book: AudioBook };
};

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
