import React, { useRef } from 'react';
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
  GestureEvent,
  PinchGestureHandlerEventPayload,
  GestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ⬇️ Afmetingen van je kaartafbeelding
const imageWidth = 3938;
const imageHeight = 2363;

// 🔧 Clamp-helper
const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.max(min, Math.min(value, max));
};

// 🔧 Bereken pan-limieten op basis van schaal
const getPanLimits = (scale: number) => {
  'worklet';
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  const offsetX = Math.max((scaledWidth - screenWidth) / 2, 0);
  const offsetY = Math.max((scaledWidth - screenWidth) / 2, 0);

  return {
    minX: -offsetX,
    maxX: offsetX,
    minY: -offsetY,
    maxY: offsetY,
  };
};

const HomeScreen = () => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      const limits = getPanLimits(scale.value);
      translateX.value = withSpring(clamp(translateX.value, limits.minX, limits.maxX));
      translateY.value = withSpring(clamp(translateY.value, limits.minY, limits.maxY));
    },
  });

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startScale: number }>({

    onStart: (_, ctx: any) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx: any) => {
      scale.value = event.scale;
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View style={{ flex: 1 }}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>NHL Stenden - Map</Text>
            </View>
              <Animated.Image
                source={require('../../assets/images/nhl-stenden-1.png')}
                style={[
                  {
                    width: imageWidth,
                    height: imageHeight,
                    alignSelf: 'center',
                  },
                  animatedStyle,
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#005aa7',
    justifyContent: 'center',
    padding: 15,
    zIndex: 10,
    elevation: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffff',
  },
});

export default HomeScreen;
