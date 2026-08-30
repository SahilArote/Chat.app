import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
    display: {
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 40,
        letterSpacing: -0.5
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        letterSpacing: -0.3
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
        letterSpacing: -0.2
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        letterSpacing: -0.1
    },
    body: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22,
        letterSpacing: 0
    },
    bodySmall: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
        letterSpacing: 0
    },
    caption: {
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0.2
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
        letterSpacing: 0.3
    },
    button: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 0.2
    }
} as const;

export type TypographyToken = keyof typeof typography;
export default typography;
