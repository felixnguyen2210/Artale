import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ProgressBarProps {
	currentTime: number;
	duration: number;
	onSeek: (time: number) => void;
}

export const ProgressBar = ({
	currentTime,
	duration,
	onSeek
}: ProgressBarProps) => {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	const handlePress = (event: any) => {
		const { locationX, target } = event.nativeEvent;
		target.measure((_x: number, _y: number, width: number) => {
			const position = (locationX / width) * duration;
			onSeek(position);
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.time}>{formatTime(currentTime)}</Text>
			<Pressable style={styles.progressContainer} onPress={handlePress}>
				<View style={styles.progressBg} />
				<View style={[styles.progressFill, { width: `${progress}%` }]} />
			</Pressable>
			<Text style={styles.time}>{formatTime(duration)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md
	},
	time: {
		color: colors.text.secondary,
		fontSize: 12,
		width: 45
	},
	progressContainer: {
		flex: 1,
		height: 4,
		marginHorizontal: spacing.sm,
		borderRadius: 2,
		overflow: 'hidden'
	},
	progressBg: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: colors.glass.light
	},
	progressFill: {
		height: '100%',
		backgroundColor: colors.primary
	}
});
