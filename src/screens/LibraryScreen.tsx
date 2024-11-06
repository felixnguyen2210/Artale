import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/common/GradientBackground';
import { LibraryHeader } from '../components/library/LibraryHeader';
import { CategoryTabs } from '../components/library/CategoryTabs';
import { SearchBar } from '../components/library/SearchBar';
import { AudioBookList } from '../components/library/AudioBookList';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { spacing } from '../theme/spacing';
import { useDebounce } from '../hooks/useDebounce';
import { AudioTest } from '../components/test/AudioTest';

const LibraryScreen = () => {
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 300);

	const handleSearch = (text: string) => {
		setSearchQuery(text);
	};

	const handleClearSearch = () => {
		setSearchQuery('');
	};

	return (
		<SafeAreaView style={styles.container}>
			<GradientBackground>
				<View style={styles.header}>
					<LibraryHeader />
					<SearchBar
						value={searchQuery}
						onChangeText={handleSearch}
						onClear={handleClearSearch}
					/>
					<CategoryTabs
						selectedCategory={selectedCategory}
						onSelectCategory={setSelectedCategory}
					/>
				</View>
				<View style={styles.content}>
					<AudioBookList
						searchQuery={debouncedSearch}
						category={selectedCategory}
					/>
				</View>
				<MiniPlayer />
			</GradientBackground>
			<AudioTest />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		paddingBottom: spacing.sm
	},
	content: {
		flex: 1,
		marginBottom: 80 // Space for MiniPlayer
	}
});

export default LibraryScreen;
