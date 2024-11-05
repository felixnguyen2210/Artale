import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CategoryTabsProps {
	selectedCategory: string;
	onSelectCategory: (category: string) => void;
}

export const CategoryTabs = ({
	selectedCategory,
	onSelectCategory
}: CategoryTabsProps) => {
	const categories = ['All', 'Books', 'Audio', 'Art'];

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.container}
			contentContainerStyle={styles.content}>
			{categories.map((category) => (
				<TouchableOpacity
					key={category}
					style={[
						styles.tab,
						selectedCategory === category && styles.selectedTab
					]}
					onPress={() => onSelectCategory(category)}>
					<Text
						style={[
							styles.tabText,
							selectedCategory === category && styles.selectedTabText
						]}>
						{category}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.md
	},
	content: {
		paddingHorizontal: spacing.lg,
		gap: spacing.sm
	},
	tab: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		backgroundColor: colors.glass.light,
		borderRadius: 20
	},
	selectedTab: {
		backgroundColor: colors.glass.heavy
	},
	tabText: {
		color: colors.text.secondary,
		fontSize: 16
	},
	selectedTabText: {
		color: colors.text.primary,
		fontWeight: '600'
	}
});
