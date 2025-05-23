import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface HeaderButtonProps {
    icon: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

interface AppHeaderProps {
    leftButton?: HeaderButtonProps;
    rightButton?: HeaderButtonProps;
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    title?: string;
    children?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    leftButton,
    rightButton,
    containerStyle,
    titleStyle,
    title,
    children,
}) => (
    <View
        style={[
            {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                backgroundColor: '#222',
            },
            containerStyle,
        ]}
    >
        {leftButton ? (
            <TouchableOpacity onPress={leftButton.onPress} style={leftButton.style}>
                {leftButton.icon}
            </TouchableOpacity>
        ) : (
            <View style={{ width: 24 }} />
        )}

        {children ? (
            children
        ) : title ? (
            <Text style={[{ color: 'white', fontSize: 18, fontWeight: 'bold' }, titleStyle]}>
                {title}
            </Text>
        ) : null}

        {rightButton ? (
            <TouchableOpacity onPress={rightButton.onPress} style={rightButton.style}>
                {rightButton.icon}
            </TouchableOpacity>
        ) : (
            <View style={{ width: 24 }} />
        )}
    </View>
);

export default AppHeader;