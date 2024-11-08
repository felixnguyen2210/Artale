import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView
} from 'react-native-gesture-handler';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
	runOnJS
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ProgressBarProps {
	currentTime: number;
	duration: number;
	onSeek: (time: number) => Promise<void>;
}

export const ProgressBar = ({
	currentTime = 0,
	duration = 0,
	onSeek
}: ProgressBarProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [width, setWidth] = useState(0);
	const progressWidth = useSharedValue(0);
	const handleOpacity = useSharedValue(0);
	const handleScale = useSharedValue(0);
	const progressHeight = useSharedValue(4);
	const progressGlow = useSharedValue(0);
	const isSeekingRef = useRef(false);

	const formatTime = useCallback((seconds: number) => {
		if (!isFinite(seconds) || seconds < 0) return '0:00';
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		if (hrs > 0) {
			return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
				.toString()
				.padStart(2, '0')}`;
		}
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}, []);

	const handleSeek = async (position: number) => {
		if (isSeekingRef.current || !isFinite(position)) return;
		isSeekingRef.current = true;
		try {
			await onSeek(position);
		} catch (error) {
			console.error('Error while seeking:', error);
		} finally {
			isSeekingRef.current = false;
		}
	};

	const panGesture = Gesture.Pan()
		.onBegin((event) => {
			handleOpacity.value = withSpring(1);
			handleScale.value = withSpring(1);
			progressHeight.value = withSpring(8);
			progressGlow.value = withSpring(1);
			runOnJS(setIsDragging)(true);
			progressWidth.value = Math.max(0, Math.min(event.x, width));
		})
		.onUpdate((event) => {
			progressWidth.value = Math.max(0, Math.min(event.x, width));
		})
		.onFinalize(() => {
			handleOpacity.value = withTiming(0);
			handleScale.value = withSpring(0);
			progressHeight.value = withSpring(4);
			progressGlow.value = withSpring(0);
			runOnJS(setIsDragging)(false);
			if (width > 0) {
				const position = (progressWidth.value / width) * duration;
				runOnJS(handleSeek)(position);
			}
		});

	const progressStyle = useAnimatedStyle(() => {
		// Add safety checks
		const safeWidth = width || 0;
		const safeDuration = Math.max(duration, 0.1); // Prevent division by zero
		const safeCurrentTime = Math.max(currentTime, 0);

		const currentProgress = isDragging
			? progressWidth.value
			: (safeCurrentTime / safeDuration) * safeWidth;

		return {
			width: Math.max(0, Math.min(currentProgress, safeWidth)),
			height: progressHeight.value,
			shadowOpacity: progressGlow.value,
			shadowRadius: progressGlow.value * 4
		};
	});

	const handleStyle = useAnimatedStyle(() => {
		const safeWidth = width || 0;
		const safeDuration = Math.max(duration, 0.1);
		const safeCurrentTime = Math.max(currentTime, 0);

		const currentProgress = isDragging
			? progressWidth.value
			: (safeCurrentTime / safeDuration) * safeWidth;

		return {
			opacity: handleOpacity.value,
			transform: [
				{ translateX: Math.max(0, Math.min(currentProgress, safeWidth)) },
				{ translateY: -16 },
				{ scale: handleScale.value }
			]
		};
	});

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>
					{formatTime(
						isDragging ? (progressWidth.value / width) * duration : currentTime
					)}
				</Text>
				<Text style={styles.timeText}>{formatTime(duration)}</Text>
			</View>

			<GestureDetector gesture={panGesture}>
				<Animated.View
					style={styles.progressContainer}
					onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
					<View style={styles.progressBackground} />
					<Animated.View style={[styles.progressFill, progressStyle]} />
					<Animated.View style={[styles.handleContainer, handleStyle]}>
						<View style={styles.handle} />
					</Animated.View>
				</Animated.View>
			</GestureDetector>
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
		height: 32,
		justifyContent: 'center',
		position: 'relative'
	},
	progressBackground: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: 4,
		backgroundColor: colors.glass.light,
		borderRadius: 2,
		top: '50%',
		marginTop: -2
	},
	progressFill: {
		position: 'absolute',
		left: 0,
		backgroundColor: colors.primary,
		borderRadius: 2,
		top: '50%',
		marginTop: -2,
		shadowColor: colors.primary,
		shadowOffset: {
			width: 0,
			height: 0
		},
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 0
	},
	handleContainer: {
		position: 'absolute',
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
		left: -16,
		top: '50%',
		transform: [{ translateY: -16 }]
	},
	handle: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: colors.primary,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	}
});
