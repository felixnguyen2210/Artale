import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';

interface PlayerControlsProps {
	isPlaying: boolean;
	onPlayPause: () => void;
	onSkipForward: () => void;
	onSkipBack: () => void;
}

export const PlayerControls = ({
	isPlaying,
	onPlayPause,
	onSkipForward,
	onSkipBack
}: PlayerControlsProps) => {
	return (
		<GlassContainer style={styles.container}>
			<TouchableOpacity onPress={onSkipBack} style={styles.secondaryButton}>
				<SkipBack color={colors.text.primary} size={24} />
			</TouchableOpacity>

			<TouchableOpacity onPress={onPlayPause} style={styles.primaryButton}>
				{isPlaying ? (
					<Pause color={colors.text.primary} size={32} />
				) : (
					<Play color={colors.text.primary} size={32} />
				)}
			</TouchableOpacity>

			<TouchableOpacity onPress={onSkipForward} style={styles.secondaryButton}>
				<SkipForward color={colors.text.primary} size={24} />
			</TouchableOpacity>
		</GlassContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: spacing.md,
		gap: spacing.lg
	},
	primaryButton: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: colors.primary,
		justifyContent: 'center',
		alignItems: 'center'
	},
	secondaryButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
