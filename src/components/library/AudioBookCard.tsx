import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	ActivityIndicator,
	ViewStyle,
	TextStyle,
	ImageStyle
} from 'react-native';
import { Book } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';
import { AudioBook } from '../../types/audio';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AudioBookCardProps {
	book: AudioBook;
}

export const AudioBookCard = ({ book }: AudioBookCardProps) => {
	const navigation = useNavigation<NavigationProp>();
	const [isLoading, setIsLoading] = useState(false);

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
	};

	const handlePress = async () => {
		if (isLoading) return;

		try {
			setIsLoading(true);

			if (!book.chapters || book.chapters.length === 0) {
				console.error('Invalid book data: No chapters found', book);
				return;
			}

			if (!book.chapters[0]?.audioUrl) {
				console.error('Invalid book data: No audio URL found', book);
				return;
			}

			navigation.navigate('BookDetails', { book });
		} catch (error) {
			console.error('Error navigating to book details:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<TouchableOpacity onPress={handlePress} disabled={isLoading}>
			<GlassContainer style={styles.container}>
				<View style={styles.content}>
					{book.coverUrl ? (
						<Image source={{ uri: book.coverUrl }} style={styles.cover} />
					) : (
						<View style={styles.placeholderCover}>
							<Book color={colors.text.primary} size={32} />
						</View>
					)}
					<View style={styles.info}>
						<Text style={styles.title} numberOfLines={1}>
							{book.title}
						</Text>
						<Text style={styles.author} numberOfLines={1}>
							{book.author}
						</Text>
						<Text style={styles.duration}>{formatDuration(book.duration)}</Text>
					</View>
					{isLoading && (
						<View style={styles.loadingOverlay}>
							<ActivityIndicator color={colors.primary} />
						</View>
					)}
				</View>
			</GlassContainer>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.sm
	} as ViewStyle,
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md
	} as ViewStyle,
	cover: {
		width: 60,
		height: 60,
		borderRadius: 8
	} as ImageStyle,
	placeholderCover: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	} as ViewStyle,
	info: {
		flex: 1,
		marginLeft: spacing.md
	} as ViewStyle,
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary
	} as TextStyle,
	author: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4
	} as TextStyle,
	duration: {
		fontSize: 12,
		color: colors.text.tertiary,
		marginTop: 4
	} as TextStyle,
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8
	} as ViewStyle
});
