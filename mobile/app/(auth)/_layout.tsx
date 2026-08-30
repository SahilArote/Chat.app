import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    );
}
