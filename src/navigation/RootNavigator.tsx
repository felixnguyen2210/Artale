import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	Home,
	BookOpen,
	PlayCircle,
	Image as ImageIcon,
	User
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import LibraryScreen from '../screens/LibraryScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen';

// Temporary placeholder screens
const PlaceholderScreen = () => null;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.gradient.start,
					borderTopWidth: 0
				},
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.text.secondary
			}}>
			<Tab.Screen
				name='Home'
				component={PlaceholderScreen}
				options={{
					tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
				}}
			/>
			<Tab.Screen
				name='Library'
				component={LibraryScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<BookOpen size={size} color={color} />
					)
				}}
			/>
			<Tab.Screen
				name='Player'
				component={PlaceholderScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<PlayCircle size={size} color={color} />
					)
				}}
			/>
			<Tab.Screen
				name='Gallery'
				component={PlaceholderScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<ImageIcon size={size} color={color} />
					)
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={PlaceholderScreen}
				options={{
					tabBarIcon: ({ color, size }) => <User size={size} color={color} />
				}}
			/>
		</Tab.Navigator>
	);
};

const RootNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='MainTabs' component={MainTabs} />
			<Stack.Screen
				name='AudioPlayer'
				component={AudioPlayerScreen}
				options={{
					presentation: 'modal',
					animation: 'slide_from_bottom'
				}}
			/>
		</Stack.Navigator>
	);
};

export default RootNavigator;
