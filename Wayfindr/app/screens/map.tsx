import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Modal,
  SafeAreaView
} from 'react-native';
import {
  GestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
  GestureHandlerRootView,
  PinchGestureHandler,
  State
} from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import MapMarker from '../../components/MapMarker';
import LocationModal from '../../components/LocationModal';
import { schoolLocations, SchoolLocation } from '../../data/schooldata';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState<SchoolLocation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // Refs
  const panRef = useRef(1);
  const pinchRef = useRef(1);

  // Gesture handlers
  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart: (event) => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    },
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      const maxTranslateX = (screenWidth * (scale.value - 1)) / 2;
      const maxTranslateY = (screenHeight * (scale.value - 1)) / 2;

      translateX.value = withSpring(
        Math.max(-maxTranslateX, Math.min(translateX.value, maxTranslateX))
      );
      translateY.value = withSpring(
        Math.max(-maxTranslateY, Math.min(translateY.value, maxTranslateY))
      );
    },
  });

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      // Store initial values
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      // Add boundary constraints
      const maxTranslateX = (screenWidth * (scale.value - 1)) / 2;
      const maxTranslateY = (screenHeight * (scale.value - 1)) / 2;
      
      if (translateX.value > maxTranslateX) {
        translateX.value = withSpring(maxTranslateX);
      } else if (translateX.value < -maxTranslateX) {
        translateX.value = withSpring(-maxTranslateX);
      }
      
      if (translateY.value > maxTranslateY) {
        translateY.value = withSpring(maxTranslateY);
      } else if (translateY.value < -maxTranslateY) {
        translateY.value = withSpring(-maxTranslateY);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleMarkerPress = (location: SchoolLocation) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const zoomToRegion = (location: SchoolLocation) => {
    const targetScale = 2;
    const targetX = -((location.x - screenWidth / 2) * targetScale);
    const targetY = -((location.y - screenHeight / 2) * targetScale);
    
    scale.value = withSpring(targetScale);
    translateX.value = withSpring(targetX);
    translateY.value = withSpring(targetY);
  };

  const resetZoom = () => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NHL Stenden - Map</Text>
        <TouchableOpacity onPress={resetZoom} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <PinchGestureHandler
          ref={pinchRef}
          onGestureEvent={pinchHandler}
          simultaneousHandlers={panRef}
        >
          <Animated.View style={StyleSheet.absoluteFill}>
            <PanGestureHandler
              ref={panRef}
              onGestureEvent={panHandler}
              simultaneousHandlers={pinchRef}
            >
              <Animated.View style={[styles.mapView, animatedStyle]}>
                {/* School Map Background */}
                <View style={styles.mapBackground}>
                  <Image 
                    source={require('../../assets/images/nhl-stenden-1.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Map Markers */}
                {schoolLocations.map((location) => (
                  <MapMarker
                    key={location.id}
                    location={location}
                    onPress={() => handleMarkerPress(location)}
                    scale={scale}
                  />
                ))}
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </View>

      {/* Quick Access Buttons */}
      <View style={styles.quickAccess}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {schoolLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.quickButton}
              onPress={() => zoomToRegion(location)}
            >
              <Ionicons name={location.icon as any} size={20} color="#6366f1" />
              <Text style={styles.quickButtonText}>{location.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Location Modal */}
      <LocationModal
        location={selectedLocation}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onZoomTo={() => {
          if (selectedLocation) {
            zoomToRegion(selectedLocation);
            setModalVisible(false);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#6366f1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  resetButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  mapView: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapBackground: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 20,
  },
  quickAccess: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quickButton: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    minWidth: 80,
  },
  quickButtonText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});