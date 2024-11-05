import React, { useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated
} from 'react-native';
import { Book, Music, Film, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { CollectionCardProps } from '../../types/collection';
import { GlassContainer } from '../common/GlassContainer';
import { useScale } from '../../hooks/useScale';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const CollectionCard = ({
	collection,
	onPress
}: CollectionCardProps) => {
	const scale = useRef(new Animated.Value(1)).current;
	const { onPressIn, onPressOut } = useScale(scale);

	const getIcon = () => {
		const iconProps = { size: 24, color: colors.text.primary };
		const mainType = collection.mediaTypes[0];

		switch (mainType) {
			case 'audio':
				return <Music {...iconProps} />;
			case 'ebook':
				return <Book {...iconProps} />;
			case 'movie':
				return <Film {...iconProps} />;
			case 'art':
				return <ImageIcon {...iconProps} />;
			default:
				return <Book {...iconProps} />;
		}
	};

	return (
		<AnimatedTouchable
			onPress={() => onPress(collection.id)}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
			style={[
				styles.card,
				{ backgroundColor: collection.color },
				{ transform: [{ scale }] }
			]}>
			<GlassContainer style={styles.cardContent}>
				<View style={styles.iconContainer}>{getIcon()}</View>
				<Text style={styles.cardTitle}>{collection.name}</Text>
				<Text style={styles.itemCount}>{collection.itemCount} items</Text>
			</GlassContainer>
		</AnimatedTouchable>
	);
};

const styles = StyleSheet.create({
	card: {
		width: '47%', // Slightly less than 50% to account for gap
		aspectRatio: 1,
		borderRadius: 24,
		overflow: 'hidden'
	},
	cardContent: {
		flex: 1,
		padding: spacing.md,
		justifyContent: 'space-between'
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary,
		marginTop: spacing.sm
	},
	itemCount: {
		fontSize: 14,
		color: colors.text.secondary
	}
});
