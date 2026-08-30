import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function RootIndex() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect href="/(app)" />;
    }

    return <Redirect href="/(auth)" />;
}
