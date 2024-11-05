import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Forward, Rewind } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GlassContainer } from '../common/GlassContainer';

interface PlaybackSettingsProps {
	playbackRate: number;
	onPlaybackRateChange: (rate: number) => void;
	onSleepTimerPress: () => void;
}

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];

export const PlaybackSettings = ({
	playbackRate,
	onPlaybackRateChange,
	onSleepTimerPress
}: PlaybackSettingsProps) => {
	return (
		<GlassContainer style={styles.container}>
			<View style={styles.settingGroup}>
				<Text style={styles.settingLabel}>Playback Speed</Text>
				<View style={styles.speedButtons}>
					{PLAYBACK_RATES.map((rate) => (
						<TouchableOpacity
							key={rate}
							style={[
								styles.speedButton,
								playbackRate === rate && styles.activeSpeedButton
							]}
							onPress={() => onPlaybackRateChange(rate)}>
							<Text
								style={[
									styles.speedText,
									playbackRate === rate && styles.activeSpeedText
								]}>
								{rate}x
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<View style={styles.separator} />

			<TouchableOpacity style={styles.timerButton} onPress={onSleepTimerPress}>
				<Clock color={colors.text.primary} size={20} />
				<Text style={styles.timerText}>Sleep Timer</Text>
			</TouchableOpacity>
		</GlassContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.md,
		marginHorizontal: spacing.lg,
		marginVertical: spacing.md
	},
	settingGroup: {
		marginBottom: spacing.md
	},
	settingLabel: {
		fontSize: 14,
		color: colors.text.secondary,
		marginBottom: spacing.sm
	},
	speedButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	speedButton: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		borderRadius: 16,
		backgroundColor: colors.glass.light
	},
	activeSpeedButton: {
		backgroundColor: colors.primary
	},
	speedText: {
		color: colors.text.secondary,
		fontSize: 14
	},
	activeSpeedText: {
		color: colors.text.primary,
		fontWeight: '600'
	},
	separator: {
		height: 1,
		backgroundColor: colors.glass.medium,
		marginVertical: spacing.md
	},
	timerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm
	},
	timerText: {
		color: colors.text.primary,
		fontSize: 14
	}
});
