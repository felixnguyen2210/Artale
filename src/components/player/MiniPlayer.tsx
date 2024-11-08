import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pause, Play, Book } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

export const MiniPlayer = () => {
	const { state, play, pause } = useAudioPlayer();
	const navigation = useNavigation();

	// Don't show if no book is selected
	if (!state.currentBook) return null;

	const handlePlayPause = async () => {
		if (state.isPlaying) {
			await pause();
		} else {
			await play();
		}
	};

	const handlePress = () => {
		if (state.currentBook) {
			// Extra type guard for TypeScript
			navigation.navigate('AudioPlayer', {
				book: state.currentBook // Now TypeScript knows this is defined
			});
		}
	};

	return (
		<GlassContainer style={styles.container}>
			<TouchableOpacity style={styles.content} onPress={handlePress}>
				<View style={styles.bookInfo}>
					<View style={styles.iconContainer}>
						<Book color={colors.text.primary} size={24} />
					</View>
					<View style={styles.textContainer}>
						<Text style={styles.title} numberOfLines={1}>
							{state.currentBook.title}
						</Text>
						<Text style={styles.author} numberOfLines={1}>
							{state.currentBook.author}
						</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
					{state.isPlaying ? (
						<Pause color={colors.text.primary} size={24} />
					) : (
						<Play color={colors.text.primary} size={24} />
					)}
				</TouchableOpacity>
			</TouchableOpacity>
			{/* Progress bar */}
			<View style={styles.progressContainer}>
				<View
					style={[
						styles.progressBar,
						{
							width: `${(state.currentTime / state.duration) * 100}%`
						}
					]}
				/>
			</View>
		</GlassContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		margin: spacing.sm,
		marginBottom: 80 // Space for bottom tab bar
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: spacing.sm
	},
	bookInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textContainer: {
		flex: 1,
		marginLeft: spacing.sm
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary
	},
	author: {
		fontSize: 14,
		color: colors.text.secondary,
		marginTop: 2
	},
	playButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	},
	progressContainer: {
		height: 2,
		backgroundColor: colors.glass.light,
		overflow: 'hidden'
	},
	progressBar: {
		height: '100%',
		backgroundColor: colors.primary
	}
});
