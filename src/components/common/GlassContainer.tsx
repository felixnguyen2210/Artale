import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';

interface GlassContainerProps {
	children: React.ReactNode;
	style?: ViewStyle;
}

export const GlassContainer = ({ children, style }: GlassContainerProps) => {
	return (
		<View style={[styles.container, style]}>
			<BlurView intensity={20} style={StyleSheet.absoluteFill} tint='light' />
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		backgroundColor: colors.glass.medium,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: colors.glass.light
	}
});
