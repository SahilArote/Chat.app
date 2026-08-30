import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { colors, typography, TypographyToken } from '../theme';

export interface AppTextProps extends TextProps {
    variant?: TypographyToken;
    color?: string;
    weight?: TextStyle['fontWeight'];
    align?: TextStyle['textAlign'];
    children?: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
    variant = 'body',
    color = colors.textPrimary,
    weight,
    align,
    style,
    children,
    ...props
}) => {
    const textStyle: TextStyle = {
        ...typography[variant],
        color,
        ...(weight ? { fontWeight: weight } : {}),
        ...(align ? { textAlign: align } : {})
    };

    return (
        <Text style={[textStyle, style]} {...props}>
            {children}
        </Text>
    );
};

export default AppText;
