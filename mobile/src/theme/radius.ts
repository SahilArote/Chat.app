export const radius = {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999
} as const;

export type RadiusToken = keyof typeof radius;
export default radius;
