import { useCallback } from 'react';
import { Animated } from 'react-native';

export const useScale = (
	scaleValue: Animated.Value,
	activeScale: number = 0.95
) => {
	const onPressIn = useCallback(() => {
		Animated.spring(scaleValue, {
			toValue: activeScale,
			useNativeDriver: true
		}).start();
	}, [scaleValue, activeScale]);

	const onPressOut = useCallback(() => {
		Animated.spring(scaleValue, {
			toValue: 1,
			useNativeDriver: true
		}).start();
	}, [scaleValue]);

	return { onPressIn, onPressOut };
};
