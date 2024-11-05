import { MediaType } from './theme';

export interface Collection {
	id: string;
	name: string;
	itemCount: number;
	mediaTypes: MediaType[];
	color: string;
	icon?: string;
}

export interface CollectionCardProps {
	collection: Collection;
	onPress: (collectionId: string) => void;
}
