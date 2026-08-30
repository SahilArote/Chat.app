export const colors = {
    primary: '#6366F1',
    primaryPressed: '#4F46E5',
    background: '#0A0D14',
    surface: '#121624',
    surfaceElevated: '#1A2035',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#1E293B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    online: '#10B981',
    unread: '#6366F1',
    messageIncoming: '#161C2E',
    messageOutgoing: '#4F46E5'
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40
} as const;

export const radius = {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999
} as const;

export const theme = {
    colors,
    spacing,
    radius
};

export default theme;
