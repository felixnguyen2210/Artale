import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Play, Pause, Book } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';
import { useAudioPlayerContext } from '../../contexts/AudioPlayerContext';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MiniPlayer = () => {
	const navigation = useNavigation<NavigationProp>();
	const { playerState, currentBook, playPause } = useAudioPlayerContext();

	if (!currentBook) return null;

	return (
		<TouchableOpacity onPress={() => navigation.navigate('AudioPlayer')}>
			<GlassContainer style={styles.container}>
				<View style={styles.bookInfo}>
					<View style={styles.coverContainer}>
						{currentBook.coverUrl ? (
							<Image
								source={{ uri: currentBook.coverUrl }}
								style={styles.cover}
								resizeMode='cover'
							/>
						) : (
							<Book color={colors.text.primary} size={24} />
						)}
					</View>
					<View style={styles.textContainer}>
						<Text style={styles.title} numberOfLines={1}>
							{currentBook.title}
						</Text>
						<Text style={styles.author} numberOfLines={1}>
							{currentBook.author}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					onPress={(e) => {
						e.stopPropagation();
						playPause();
					}}
					style={styles.playButton}>
					{playerState.isPlaying ? (
						<Pause color={colors.text.primary} size={24} />
					) : (
						<Play color={colors.text.primary} size={24} />
					)}
				</TouchableOpacity>
			</GlassContainer>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: spacing.md,
		margin: spacing.sm,
		borderRadius: 16
	},
	bookInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	coverContainer: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden'
	},
	cover: {
		width: '100%',
		height: '100%'
	},
	textContainer: {
		marginLeft: spacing.md,
		flex: 1
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
	}
});
