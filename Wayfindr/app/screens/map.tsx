import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  PinchGestureHandler,
  PanGestureHandler,
  PinchGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated,
{
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
  runOnJS,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import MapMarker from '../../components/MapMarker';
import LocationModal from '../../components/LocationModal';
import { schoolLocations, SchoolLocation } from '../../data/schooldata';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState<SchoolLocation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigation = useNavigation();

  // Animation values
  const initialScale = 1;
const initialTranslateX = 0;
const initialTranslateY = 0;

const scale = useSharedValue(initialScale);
const translateX = useSharedValue(initialTranslateX);
const translateY = useSharedValue(initialTranslateY);
const offsetX = useSharedValue(initialTranslateX);
const offsetY = useSharedValue(initialTranslateY);

  // Refs
  const panRef = useRef(null);
  const pinchRef = useRef(null);

  // Gesture handlers
  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart: (_, ctx: any) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx: any) => {
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
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
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
    offsetX.value = targetX;
    offsetY.value = targetY;
  };

  const resetZoom = () => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    offsetX.value = 0;
    offsetY.value = 0;
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
                {/* Background image als achtergrond */}
                <Image
                  source={require('../../assets/images/nhl-stenden-1.png')}
                  style={StyleSheet.absoluteFill}
                  resizeMode="contain"
                />

                {/* Markers */}
                {schoolLocations.map((location) => (
                  <MapMarker
                    key={location.id}
                    location={location}
                    onPress={() => handleMarkerPress(location)}
                    scale={scale as SharedValue<number>}
                  />
                ))}
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </View>

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
    backgroundColor: '#000', // <-- zwart
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
    backgroundColor: '#000', // <-- zwart
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
    width: screenWidth,
    height: screenWidth,
    borderRadius: 0,
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
