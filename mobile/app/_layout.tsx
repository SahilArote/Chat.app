import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../src/theme';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <AuthProvider>
                    <StatusBar style="light" backgroundColor={colors.background} />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: colors.background },
                            animation: 'slide_from_right'
                        }}
                    >
                        <Stack.Screen name="(app)" options={{ headerShown: false }} />
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen
                            name="chat/[conversationId]"
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <Stack.Screen
                            name="group/[conversationId]"
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <Stack.Screen
                            name="group/create"
                            options={{ headerShown: false, animation: 'slide_from_bottom' }}
                        />
                        <Stack.Screen
                            name="user/[userId]"
                            options={{ headerShown: false, animation: 'slide_from_right' }}
                        />
                        <Stack.Screen
                            name="search"
                            options={{ headerShown: false, animation: 'fade' }}
                        />
                    </Stack>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    }
});
