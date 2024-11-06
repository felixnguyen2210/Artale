import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Book, PlayCircle, Pause } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';
import { AudioBook } from '../../types/audio';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

interface AudioBookCardProps {
	book: AudioBook;
}

export const AudioBookCard = ({ book }: AudioBookCardProps) => {
	const { state, loadBook, play, pause } = useAudioPlayer();

	const isThisBookPlaying =
		state.currentBook?.id === book.id && state.isPlaying;

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
	};

	const handlePlayPress = async () => {
		console.log('Book data:', book); // Add this to see what data we have
		if (state.currentBook?.id === book.id) {
			if (state.isPlaying) {
				await pause();
			} else {
				await play();
			}
		} else {
			await loadBook(book);
			await play();
		}
	};

	return (
		<TouchableOpacity onPress={handlePlayPress}>
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
					<TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
						{isThisBookPlaying ? (
							<Pause color={colors.text.primary} size={24} />
						) : (
							<PlayCircle color={colors.text.primary} size={24} />
						)}
					</TouchableOpacity>
				</View>
			</GlassContainer>
		</TouchableOpacity>
	);
};

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
