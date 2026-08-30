import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../src/theme';

export default function SettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="account" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="appearance" />
            <Stack.Screen name="storage" />
        </Stack>
    );
}
