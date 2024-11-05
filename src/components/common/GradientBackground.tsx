import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

interface GradientBackgroundProps {
	children: React.ReactNode;
}

export const GradientBackground = ({ children }: GradientBackgroundProps) => {
	return (
		<LinearGradient
			colors={[
				colors.gradient.start,
				colors.gradient.middle,
				colors.gradient.end
			]}
			style={styles.gradient}>
			{children}
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	gradient: {
		flex: 1
	}
});
