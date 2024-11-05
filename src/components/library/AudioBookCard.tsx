import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Book, PlayCircle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';
import { AudioBook } from '../../services/audioBooks/types';

interface AudioBookCardProps {
	book: AudioBook;
	onPress?: (book: AudioBook) => void;
}

export const AudioBookCard = ({ book, onPress }: AudioBookCardProps) => {
	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
	};

	return (
		<TouchableOpacity onPress={() => onPress?.(book)}>
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
						<Text style={styles.title}>{book.title}</Text>
						<Text style={styles.author}>{book.author}</Text>
						<Text style={styles.duration}>{formatDuration(book.duration)}</Text>
					</View>
					<TouchableOpacity style={styles.playButton}>
						<PlayCircle color={colors.text.primary} size={24} />
					</TouchableOpacity>
				</View>
			</GlassContainer>
		</TouchableOpacity>
	);
};

// Styles remain the same, just rename downloadButton to playButton
const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.sm
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md
	},
	cover: {
		width: 60,
		height: 60,
		borderRadius: 8
	},
	placeholderCover: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	},
	info: {
		flex: 1,
		marginLeft: spacing.md
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary
	},
	author: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 4
	},
	duration: {
		fontSize: 12,
		color: colors.text.tertiary,
		marginTop: 4
	},
	playButton: {
		padding: spacing.sm
	}
});
