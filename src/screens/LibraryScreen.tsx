import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/common/GradientBackground';
import { LibraryHeader } from '../components/library/LibraryHeader';
import { CategoryTabs } from '../components/library/CategoryTabs';
import { AudioBookList } from '../components/library/AudioBookList';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { spacing } from '../theme/spacing';

const LibraryScreen = () => {
	const [selectedCategory, setSelectedCategory] = useState('All');

	return (
		<SafeAreaView style={styles.container}>
			<GradientBackground>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}>
					<LibraryHeader />
					<CategoryTabs
						selectedCategory={selectedCategory}
						onSelectCategory={setSelectedCategory}
					/>
					<AudioBookList />
					<View style={styles.bottomSpace} />
				</ScrollView>
				<MiniPlayer />
			</GradientBackground>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollView: {
		flex: 1
	},
	scrollContent: {
		flexGrow: 1
	},
	bottomSpace: {
		height: 100 // Space for MiniPlayer
	}
});

export default LibraryScreen;
