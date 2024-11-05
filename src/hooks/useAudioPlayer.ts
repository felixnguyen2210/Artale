import { useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av/build/AV';
import { PlayerState } from '../types/audio';

export const useAudioPlayer = () => {
	const [sound, setSound] = useState<Sound | null>(null);
	const [playerState, setPlayerState] = useState<PlayerState>({
		isPlaying: false,
		currentTime: 0,
		duration: 0,
		playbackRate: 1,
		isBuffering: false
	});

	useEffect(() => {
		const initAudio = async () => {
			try {
				await Audio.setAudioModeAsync({
					playsInSilentModeIOS: true,
					staysActiveInBackground: true,
					shouldDuckAndroid: true
				});
			} catch (error) {
				console.error('Error initializing audio:', error);
			}
		};

		initAudio();

		return () => {
			if (sound) {
				sound.unloadAsync();
			}
		};
	}, []);

	const loadAudio = useCallback(
		async (uri: string) => {
			try {
				if (sound) {
					await sound.unloadAsync();
				}

				const { sound: newSound, status } = await Audio.Sound.createAsync(
					{ uri },
					{ shouldPlay: false, progressUpdateIntervalMillis: 1000 },
					onPlaybackStatusUpdate
				);

				setSound(newSound);

				if (status.isLoaded) {
					setPlayerState((prev) => ({
						...prev,
						duration: status.durationMillis ? status.durationMillis / 1000 : 0
					}));
				}
			} catch (error) {
				console.error('Error loading audio:', error);
			}
		},
		[sound]
	);

	const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
		if (!status.isLoaded) return;

		// Type guard to ensure we have a successful status
		const isSuccessStatus = (
			status: AVPlaybackStatus
		): status is AVPlaybackStatusSuccess => {
			return status.isLoaded;
		};

		if (isSuccessStatus(status)) {
			setPlayerState({
				isPlaying: status.isPlaying,
				currentTime: status.positionMillis / 1000,
				duration: status.durationMillis ? status.durationMillis / 1000 : 0,
				playbackRate: status.rate,
				isBuffering: status.isBuffering
			});
		}
	};

	const playPause = async () => {
		if (!sound) return;

		try {
			if (playerState.isPlaying) {
				await sound.pauseAsync();
			} else {
				await sound.playAsync();
			}
		} catch (error) {
			console.error('Error toggling playback:', error);
		}
	};

	const seek = async (time: number) => {
		if (!sound) return;
		try {
			await sound.setPositionAsync(Math.floor(time * 1000));
		} catch (error) {
			console.error('Error seeking:', error);
		}
	};

	const setPlaybackRate = async (rate: number) => {
		if (!sound) return;
		try {
			await sound.setRateAsync(rate, true);
		} catch (error) {
			console.error('Error setting playback rate:', error);
		}
	};

	return {
		playerState,
		loadAudio,
		playPause,
		seek,
		setPlaybackRate
	};
};
