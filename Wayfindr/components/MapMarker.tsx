import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SchoolLocation } from '../data/schooldata';

interface Props {
  location: SchoolLocation;
  onPress: () => void;
}

export default function MapMarker({ location, onPress }: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.markerContainer,
        {
          position: 'absolute',
          left: location.x,
          top: location.y,
          zIndex: 10,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.marker}>
        <View style={[styles.markerIcon, { backgroundColor: location.color }]}>
          <Ionicons name={location.icon as any} size={24} color="#fff" />
        </View>
        <Text style={styles.markerText}>{location.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {},
  marker: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 48,
    height: 48,
    borderRadius: 30 ,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  markerText: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    backgroundColor: '#fffcc0',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
});
