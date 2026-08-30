export const colors = {
    // Primary Brand & Interactive
    primary: '#6366F1',           // Indigo electric primary
    primaryPressed: '#4F46E5',    // Deep indigo pressed state
    primarySubtle: 'rgba(99, 102, 241, 0.15)',

    // Backgrounds & Surfaces
    background: '#0A0D14',        // Deep obsidian background
    surface: '#121624',           // Card and container surface
    surfaceElevated: '#1A2035',   // Modal and bottom sheet surface
    surfaceHover: '#1F263E',

    // Text & Content
    textPrimary: '#F8FAFC',       // High-contrast heading & body text
    textSecondary: '#94A3B8',     // Subtitle & secondary information
    textMuted: '#64748B',         // Inactive & timestamp metadata
    textInverse: '#0A0D14',       // Text on bright accents

    // Borders & Dividers
    border: '#1E293B',            // Subtle card & item borders
    borderLight: '#334155',       // Active input & elevated borders
    borderFocus: '#6366F1',

    // Feedback & Indicators
    success: '#10B981',           // Emerald success
    warning: '#F59E0B',           // Amber warning
    error: '#EF4444',             // Rose error
    online: '#10B981',            // Presence green indicator
    unread: '#6366F1',            // Unread badge indicator

    // Chat Message Bubbles
    messageIncoming: '#161C2E',   // Incoming bubble surface
    messageOutgoing: '#4F46E5',   // Outgoing bubble accent

    // Transparent Overlays
    overlay: 'rgba(10, 13, 20, 0.75)',
    backdrop: 'rgba(0, 0, 0, 0.60)'
} as const;

export type ColorToken = keyof typeof colors;
export default colors;
