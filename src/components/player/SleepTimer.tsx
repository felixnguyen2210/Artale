// src/components/player/SleepTimer.tsx
import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface SleepTimerProps {
	onSetTimer: (minutes: number) => void;
	onCancel: () => void;
	remainingTime: number | null;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const SleepTimer = ({
	onSetTimer,
	onCancel,
	remainingTime
}: SleepTimerProps) => {
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	const handleSetTimer = () => {
		if (hours === 0 && minutes === 0) {
			const seconds_to_minutes = seconds / 60;

			onSetTimer(seconds_to_minutes);
		} else {
			const totalMinutes = hours * 60 + minutes + seconds / 60;
			onSetTimer(totalMinutes);
		}
	};
	const renderPickerItems = (
		count: number,
		label: string,
		setValue: (value: number) => void
	) => {
		return (
			<ScrollView
				style={styles.pickerColumn}
				snapToInterval={ITEM_HEIGHT}
				showsVerticalScrollIndicator={false}
				onMomentumScrollEnd={(e) => {
					const selectedIndex = Math.round(
						e.nativeEvent.contentOffset.y / ITEM_HEIGHT
					);
					setValue(selectedIndex);
				}}>
				<View style={{ height: PICKER_HEIGHT / 2.5 }} />
				{Array(count)
					.fill(0)
					.map((_, index) => (
						<View key={index} style={styles.pickerItem}>
							<Text style={styles.pickerText}>{`${index} ${label}`}</Text>
						</View>
					))}
				<View style={{ height: PICKER_HEIGHT / 2 }} />
			</ScrollView>
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Set Sleep Timer</Text>

			{/* Quick Presets */}
			<View style={styles.presets}>
				<TouchableOpacity
					style={styles.presetButton}
					onPress={() => onSetTimer(0.5)} // 30 seconds
				>
					<Text style={styles.presetText}>30s</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.presetButton}
					onPress={() => onSetTimer(5)}>
					<Text style={styles.presetText}>5m</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.presetButton}
					onPress={() => onSetTimer(15)}>
					<Text style={styles.presetText}>15m</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.presetButton}
					onPress={() => onSetTimer(30)}>
					<Text style={styles.presetText}>30m</Text>
				</TouchableOpacity>
			</View>

			{/* Time Picker */}
			<View style={styles.pickerContainer}>
				<View style={styles.selectionOverlay}>
					<View style={styles.selectionBorder} />
				</View>

				<View style={styles.pickerColumns}>
					{renderPickerItems(24, 'h', setHours)}
					{renderPickerItems(60, 'm', setMinutes)}
					{renderPickerItems(60, 's', setSeconds)}
				</View>
			</View>

			{/* Selected Time Display */}
			<Text style={styles.selectedTime}>
				{`${hours}h ${minutes}m ${seconds}s`}
			</Text>

			{/* Action Buttons */}
			<View style={styles.actions}>
				<TouchableOpacity
					style={[styles.button, styles.cancelButton]}
					onPress={onCancel}>
					<Text style={styles.cancelText}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.setButton]}
					onPress={handleSetTimer}>
					<Text style={styles.setText}>Start Timer</Text>
				</TouchableOpacity>
			</View>

			{/* Active Timer Display */}
			{remainingTime !== null && (
				<View style={styles.activeTimer}>
					<Text style={styles.remainingText}>
						{remainingTime < 1
							? `${Math.ceil(remainingTime * 60)}s remaining`
							: remainingTime < 60
							? `${Math.ceil(remainingTime)}m remaining`
							: `${Math.floor(remainingTime / 60)}h ${Math.ceil(
									remainingTime % 60
							  )}m remaining`}
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.md,
		alignItems: 'center'
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: spacing.lg
	},
	presets: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginBottom: spacing.lg
	},
	presetButton: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		backgroundColor: colors.glass.medium,
		borderRadius: 8
	},
	presetText: {
		color: colors.text.primary,
		fontSize: 16
	},
	pickerContainer: {
		height: PICKER_HEIGHT,
		position: 'relative',
		marginBottom: spacing.lg
	},
	selectionOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		pointerEvents: 'none'
	},
	selectionBorder: {
		height: ITEM_HEIGHT,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: colors.primary,
		backgroundColor: colors.glass.light
	},
	pickerColumns: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	pickerColumn: {
		width: 80
	},
	pickerItem: {
		height: ITEM_HEIGHT,
		alignItems: 'center',
		justifyContent: 'center'
	},
	pickerText: {
		color: colors.text.primary,
		fontSize: 16
	},
	selectedTime: {
		fontSize: 24,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: spacing.lg
	},
	actions: {
		flexDirection: 'row',
		gap: spacing.md
	},
	button: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.xl,
		borderRadius: 8
	},
	cancelButton: {
		backgroundColor: colors.glass.medium
	},
	setButton: {
		backgroundColor: colors.primary
	},
	cancelText: {
		color: colors.text.secondary,
		fontSize: 16
	},
	setText: {
		color: colors.text.primary,
		fontSize: 16,
		fontWeight: '500'
	},
	activeTimer: {
		marginTop: spacing.lg,
		padding: spacing.md,
		backgroundColor: colors.glass.light,
		borderRadius: 8
	},
	remainingText: {
		color: colors.text.primary,
		fontSize: 16
	}
});
