import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AudioPlayerProvider } from './src/contexts/AudioPlayerContext';
import RootNavigator from './src/navigation/RootNavigator';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 30 // 30 minutes (formerly cacheTime)
		}
	}
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				<AudioPlayerProvider>
					<NavigationContainer>
						<RootNavigator />
					</NavigationContainer>
				</AudioPlayerProvider>
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}
