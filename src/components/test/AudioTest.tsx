import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

export const AudioTest = () => {
	const testAudio = async () => {
		try {
			console.log('Starting audio test...');

			// 1. Fetch book data
			const testBookId = '47'; // Count of Monte Cristo
			const response = await axios.get(
				`https://librivox.org/api/feed/audiobooks/${testBookId}?format=json&extended=1`
			);

			console.log(
				'Book data received:',
				JSON.stringify(response.data, null, 2)
			);

			// 2. Get first section's audio URL
			const firstSection = response.data.books[0].sections[0];
			if (firstSection && firstSection.listen_url) {
				console.log('Testing audio URL:', firstSection.listen_url);

				// 3. Test loading audio
				const { sound } = await Audio.Sound.createAsync(
					{ uri: firstSection.listen_url },
					{ shouldPlay: false }
				);
				console.log('Audio loaded successfully');

				// 4. Test playing
				await sound.playAsync();
				console.log('Audio playing');
			}
		} catch (error) {
			console.error('Test failed:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Audio Test</Text>
			<Button title='Test Audio' onPress={testAudio} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		alignItems: 'center'
	},
	title: {
		fontSize: 20,
		marginBottom: 20
	}
});
