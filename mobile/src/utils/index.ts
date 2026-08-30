// Mobile Utilities & Responsive Helpers
export const formatTimestamp = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
