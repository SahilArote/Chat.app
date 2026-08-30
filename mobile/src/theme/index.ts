import colors, { ColorToken } from './colors';
import typography, { TypographyToken } from './typography';
import spacing, { SpacingToken } from './spacing';
import radius, { RadiusToken } from './radius';
import shadows, { ShadowToken } from './shadows';

export { colors, typography, spacing, radius, shadows };
export type { ColorToken, TypographyToken, SpacingToken, RadiusToken, ShadowToken };

export const theme = {
    colors,
    typography,
    spacing,
    radius,
    shadows
} as const;

export default theme;
