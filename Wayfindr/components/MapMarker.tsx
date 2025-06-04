import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SchoolLocation } from '../data/schooldata';

interface MapMarkerProps {
  location: SchoolLocation;
  onPress: () => void;
  imgScale: number;
  offsetX: number;
  offsetY: number;
}

export default function MapMarker({ location, onPress, imgScale, offsetX, offsetY }: MapMarkerProps) {
  const markerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 0.1 / imgScale },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.markerContainer,
        {
          position: 'absolute',
          left: location.x * imgScale + offsetX,
          top: location.y * imgScale + offsetY,
        },
        markerStyle,
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.marker}>
        <View style={[styles.markerIcon, { backgroundColor: location.color }]}>
          <Ionicons name={location.icon as any} size={18} color="#fff" />
        </View>
        <View style={styles.markerLabel}>
          <Text style={styles.markerText}>{location.name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  marker: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerLabel: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    minWidth: 60,
  },
  markerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});