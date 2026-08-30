import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base guideline metrics based on standard modern smartphone (390 x 844)
const GUIDELINE_BASE_WIDTH = 390;
const GUIDELINE_BASE_HEIGHT = 844;

export const isSmallPhone = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH >= 768;

export const scale = (size: number): number => {
    return (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;
};

export const verticalScale = (size: number): number => {
    return (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor = 0.5): number => {
    return size + (scale(size) - size) * factor;
};

// Accessibility minimum touch target standard (48x48dp)
export const MIN_TOUCH_TARGET = 48;

export const getHitSlop = (currentSize: number) => {
    if (currentSize >= MIN_TOUCH_TARGET) return undefined;
    const diff = (MIN_TOUCH_TARGET - currentSize) / 2;
    return {
        top: diff,
        bottom: diff,
        left: diff,
        right: diff
    };
};

export default {
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    isSmallPhone,
    isTablet,
    scale,
    verticalScale,
    moderateScale,
    MIN_TOUCH_TARGET,
    getHitSlop
};
