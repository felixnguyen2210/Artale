import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useSlideAnimation = (visible: boolean) => {
	const slideAnim = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 1,
					duration: 300,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true
				})
			]).start();
		} else {
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 0,
					duration: 250,
					easing: Easing.in(Easing.cubic),
					useNativeDriver: true
				}),
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true
				})
			]).start();
		}
	}, [visible]);

	const translateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [300, 0]
	});

	return { translateY, fadeAnim };
};
