import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PrinterProps } from '../data/printerprops';

interface Printers {
  marker: PrinterProps;
  onPress?: () => void;
}

export default function PrinterMarker({ marker, onPress }: Printers) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.markerContainer,
        {
          position: 'absolute',
          left: marker.x,
          top: marker.y,
          zIndex: 5,
        },
      ]}
    >
      <View style={[styles.markerBox, { backgroundColor: marker.color }]}>
        <Ionicons name={marker.icon as any} size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerBox: {
    width: 42,
    height: 42,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  markerText: {
    fontSize: 10,
    color: '#222',
    backgroundColor: '#fff8',
    paddingHorizontal: 2,
    borderRadius: 3,
    overflow: 'hidden',
  },
});