import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../Theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface SlideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SlideMenu({ isVisible, onClose }: SlideMenuProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors } = useTheme();

  const { signOut } = useAuth();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>['name'];

  const menuItems = [
    {
      icon: 'user' as FontAwesomeIconName,
      label: 'Account',
      onPress: () => {
        navigation.navigate('Account');
        onClose();
      },
    },
    {
      icon: 'cog' as FontAwesomeIconName,
      label: 'Settings',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      },
    },
  ];

  const logoutItem = {
    icon: 'sign-out' as FontAwesomeIconName,
    label: 'Logout',
    onPress: () => signOut(),
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} onTouchStart={onClose} />
      <Animated.View
        style={[
          styles.menu,
          { backgroundColor: colors.card, transform: [{ translateX: slideAnim }] }, // Add transform for sliding
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: colors.text }]}>More</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.card }]}
              onPress={item.onPress}
            >
              <FontAwesome name={item.icon} size={20} color={colors.icon} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: colors.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutButton, { backgroundColor: colors.card }]}
            onPress={logoutItem.onPress}
          >
            <FontAwesome name={logoutItem.icon} size={20} color="red" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: 'red' }]}>{logoutItem.label}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    paddingTop: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'white',
  },
});
