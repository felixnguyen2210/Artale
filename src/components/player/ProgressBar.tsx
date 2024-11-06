// src/components/player/ProgressBar.tsx
import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated
} from 'react-native';
import {
	PanGestureHandler,
	State,
	GestureHandlerRootView
} from 'react-native-gesture-handler';
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
	const [isDragging, setIsDragging] = useState(false);
	const [draggedTime, setDraggedTime] = useState(0);

	const formatTime = (seconds: number) => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		if (hrs > 0) {
			return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
				.toString()
				.padStart(2, '0')}`;
		}
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const onGestureEvent = ({ nativeEvent }: any) => {
		const width = nativeEvent.x;
		// Calculate percentage based on width of container
		const percentage = Math.max(0, Math.min(1, width / 300)); // 300 is container width
		const newTime = percentage * duration;
		setDraggedTime(newTime);
	};

	const onHandlerStateChange = ({ nativeEvent }: any) => {
		if (nativeEvent.state === State.BEGAN) {
			setIsDragging(true);
		} else if (nativeEvent.state === State.END) {
			setIsDragging(false);
			onSeek(draggedTime);
		}
	};

	const displayTime = isDragging ? draggedTime : currentTime;
	const progress = (displayTime / duration) * 100;

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>{formatTime(displayTime)}</Text>
				<Text style={styles.timeText}>{formatTime(duration)}</Text>
			</View>

			<PanGestureHandler
				onGestureEvent={onGestureEvent}
				onHandlerStateChange={onHandlerStateChange}>
				<View style={styles.progressContainer}>
					<View style={styles.progressBackground} />
					<View style={[styles.progressFill, { width: `${progress}%` }]} />
					<View
						style={[
							styles.dragHandle,
							{ left: `${progress}%` },
							isDragging && styles.dragHandleActive
						]}
					/>
				</View>
			</PanGestureHandler>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: spacing.md
	},
	timeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: spacing.xs
	},
	timeText: {
		color: colors.text.secondary,
		fontSize: 12
	},
	progressContainer: {
		height: 20,
		justifyContent: 'center'
	},
	progressBackground: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: 4,
		backgroundColor: colors.glass.light,
		borderRadius: 2
	},
	progressFill: {
		position: 'absolute',
		left: 0,
		height: 4,
		backgroundColor: colors.primary,
		borderRadius: 2
	},
	dragHandle: {
		position: 'absolute',
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: colors.primary,
		transform: [{ translateX: -8 }, { translateY: -6 }]
	},
	dragHandleActive: {
		transform: [{ translateX: -8 }, { translateY: -6 }, { scale: 1.2 }]
	}
});
