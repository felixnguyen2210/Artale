import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList
} from 'react-native';
import { Play, Headphones } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Chapter } from '../../types/audio';

interface ChapterListProps {
	chapters: Chapter[];
	currentTime: number;
	currentChapter?: Chapter;
	onChapterPress: (chapter: Chapter) => void;
}

const ChapterItem = ({
	chapter,
	isPlaying,
	isCompleted,
	onPress
}: {
	chapter: Chapter;
	isPlaying: boolean;
	isCompleted: boolean;
	onPress: () => void;
}) => {
	const formatTime = (seconds: number) => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		if (hrs > 0) {
			return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
				.toString()
				.padStart(2, '0')}`;
		}
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<TouchableOpacity
			style={[styles.chapterItem, isPlaying && styles.playingChapter]}
			onPress={onPress}>
			<View style={styles.chapterIcon}>
				{isPlaying ? (
					<Headphones color={colors.primary} size={20} />
				) : (
					<Play
						color={isCompleted ? colors.text.secondary : colors.text.primary}
						size={20}
					/>
				)}
			</View>
			<View style={styles.chapterInfo}>
				<Text
					style={[styles.chapterTitle, isCompleted && styles.completedText]}>
					{chapter.title}
				</Text>
				<Text style={styles.chapterDuration}>
					{formatTime(chapter.duration)}
				</Text>
			</View>
			{isCompleted && (
				<View style={styles.completedBadge}>
					<Text style={styles.completedBadgeText}>Completed</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

export const ChapterList = ({
	chapters,
	currentTime,
	currentChapter,
	onChapterPress
}: ChapterListProps) => {
	const getCurrentChapter = () => {
		return chapters.findIndex((chapter) =>
			currentChapter ? chapter.id === currentChapter.id : false
		);
	};

	const isChapterCompleted = (chapter: Chapter, index: number) => {
		// A chapter is completed if we're past its duration and playing a later chapter
		const currentChapterIndex = getCurrentChapter();
		if (currentChapterIndex === -1) return false;

		return (
			index < currentChapterIndex ||
			(index === currentChapterIndex &&
				currentTime >= chapter.startTime + chapter.duration)
		);
	};

	const currentChapterIndex = getCurrentChapter();

	const renderItem = ({ item, index }: { item: Chapter; index: number }) => (
		<ChapterItem
			chapter={item}
			isPlaying={index === currentChapterIndex}
			isCompleted={isChapterCompleted(item, index)}
			onPress={() => onChapterPress(item)}
		/>
	);

	return (
		<FlatList
			data={chapters}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={false}
			ListHeaderComponent={() => <Text style={styles.title}>Chapters</Text>}
		/>
	);
};

const styles = StyleSheet.create({
	listContent: {
		padding: spacing.md
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: spacing.lg
	},
	chapterItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
		marginBottom: spacing.sm,
		backgroundColor: colors.glass.light,
		borderRadius: 12
	},
	playingChapter: {
		backgroundColor: colors.glass.medium,
		borderColor: colors.primary,
		borderWidth: 1
	},
	chapterIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.glass.medium,
		justifyContent: 'center',
		alignItems: 'center'
	},
	chapterInfo: {
		flex: 1,
		marginLeft: spacing.md
	},
	chapterTitle: {
		fontSize: 16,
		color: colors.text.primary,
		marginBottom: 4
	},
	chapterDuration: {
		fontSize: 12,
		color: colors.text.secondary
	},
	completedText: {
		color: colors.text.secondary
	},
	completedBadge: {
		backgroundColor: colors.glass.heavy,
		paddingHorizontal: spacing.sm,
		paddingVertical: 4,
		borderRadius: 12,
		marginLeft: spacing.sm
	},
	completedBadgeText: {
		fontSize: 12,
		color: colors.text.primary
	}
});
