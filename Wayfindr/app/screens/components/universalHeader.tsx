import { HeaderTitle } from '@react-navigation/elements';
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';

interface UniversalHeaderButtonProps {
    icon: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

interface UniversalHeaderProps {
    leftButton?: UniversalHeaderButtonProps;
    rightButton?: UniversalHeaderButtonProps;
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    title?: string;
    children?: React.ReactNode;
}

const UniversalHeader: React.FC<UniversalHeaderProps> = ({
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
                backgroundColor: '#005aa7',
                borderBottomWidth: 1,
                borderBottomColor: '#E5E5EA',
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
            <Text style={[{ color: 'white', fontSize: 18, fontWeight: 'bold' }, styles.HeaderTitle, titleStyle]}>
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

const styles = StyleSheet.create({
    HeaderTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },});

export default UniversalHeader;