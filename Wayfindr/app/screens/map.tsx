import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
  PinchGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
} from 'react-native-reanimated';
import MapMarker from '../../components/MapMarker';
import LocationModal from '../../components/LocationModal';
import { SchoolLocation, schoolLocations } from '../../data/schooldata';

// 📱 Schermdimensies
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 🖼️ Afbeelding afmetingen
const imageWidth = 3938;
const imageHeight = 2363;

// 🔐 Schaal limieten
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

// 🔧 Clamp-helper
const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.max(min, Math.min(value, max));
};

// 🔧 Pan-limieten
const getPanLimits = (scale: number) => {
  'worklet';
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  const offsetX = Math.max((scaledWidth - screenWidth) / 1, 0);
  const offsetY = Math.max((scaledHeight - screenHeight) / 0.3, 0);

  return {
    minX: -offsetX,
    maxX: offsetX,
    minY: -offsetY,
    maxY: offsetY,
  };
};

const MapScreen = () => {
  const [floor, setFloor] = useState(1); // Start op verdieping 1
  const [selectedLocation, setSelectedLocation] = useState<SchoolLocation | null>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Reset zoom en pan bij verdiepingwissel
  useEffect(() => {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  }, [floor]);

  const getFloorImage = () => {
    switch (floor) {
      case 1:
        return require('../../assets/images/nhl-stenden-1.png');
      case 2:
        return require('../../assets/images/nhl-stenden-2.png');
      case 3:
        return require('../../assets/images/nhl-stenden-3.png');
      default:
        return require('../../assets/images/nhl-stenden-1.png');
    }
  };

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>(
    {
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
        ctx.startY = translateY.value;
      },
      onActive: (event, ctx) => {
        const limits = getPanLimits(scale.value);
        translateX.value = clamp(ctx.startX + event.translationX, limits.minX, limits.maxX);
        translateY.value = clamp(ctx.startY + event.translationY, limits.minY, limits.maxY);
      },
      onEnd: (event) => {
        const limits = getPanLimits(scale.value);
        translateX.value = withDecay({
          velocity: event.velocityX,
          clamp: [limits.minX, limits.maxX],
        });
        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [limits.minY, limits.maxY],
        });
      },
    }
  );

  const pinchHandler = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {
      startScale: number;
      focalX: number;
      focalY: number;
      startTranslateX: number;
      startTranslateY: number;
    }
  >({
    onStart: (event, ctx) => {
      ctx.startScale = scale.value;
      ctx.focalX = event.focalX;
      ctx.focalY = event.focalY;
      ctx.startTranslateX = translateX.value;
      ctx.startTranslateY = translateY.value;
    },
    onActive: (event, ctx) => {
      const nextScale = clamp(ctx.startScale * event.scale, MIN_SCALE, MAX_SCALE);
      const scaleChange = nextScale / scale.value;

      translateX.value = clamp(
        ctx.startTranslateX + (event.focalX - ctx.focalX) - (scaleChange - 1) * ctx.focalX,
        getPanLimits(nextScale).minX,
        getPanLimits(nextScale).maxX
      );
      translateY.value = clamp(
        ctx.startTranslateY + (event.focalY - ctx.focalY) - (scaleChange - 1) * ctx.focalY,
        getPanLimits(nextScale).minY,
        getPanLimits(nextScale).maxY
      );

      scale.value = nextScale;
    },
    onEnd: () => {
      const limits = getPanLimits(scale.value);
      translateX.value = withSpring(clamp(translateX.value, limits.minX, limits.maxX));
      translateY.value = withSpring(clamp(translateY.value, limits.minY, limits.maxY));
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handleMarkerPress = (location: SchoolLocation) => {
    setSelectedLocation(location);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NHL Stenden - Map</Text>
        <View style={styles.floorControls}>
          <Text style={styles.floorText}>Verdieping: {floor}</Text>
          <View style={styles.buttonGroup}>
            <Text style={styles.floorButton} onPress={() => setFloor((prev) => Math.min(prev + 1, 3))}>⬆️</Text>
            <Text style={styles.floorButton} onPress={() => setFloor((prev) => Math.max(prev - 1, 1))}>⬇️</Text>
          </View>
        </View>
      </View>

      <PanGestureHandler onGestureEvent={panHandler}>
        <Animated.View style={{ flex: 1 }}>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View style={{ flex: 1 }}>
              <Animated.View style={[styles.mapContainer, animatedStyle]}>
                <Image
                  source={getFloorImage()}
                  style={styles.mapImage}
                  resizeMode="contain"
                />
                {schoolLocations
                  .filter((location) => location.floor === floor)
                  .map((location) => (
                    <MapMarker
                      key={location.id}
                      location={location}
                      onPress={() => handleMarkerPress(location)}
                    />
                  ))}
              </Animated.View>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      <LocationModal
        location={selectedLocation}
        visible={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onZoomTo={() => {}}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#005aa7',
    justifyContent: 'center',
    padding: 15,
    zIndex: 10,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  floorControls: {
    marginTop: 5,
  },
  floorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 5,
  },
  floorButton: {
    fontSize: 22,
    color: '#fff',
    marginHorizontal: 10,
  },
  mapContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: imageWidth,
    height: imageHeight,
  },
});

export default MapScreen;
