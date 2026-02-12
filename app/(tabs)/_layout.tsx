import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import ExploreIcon from "@/assets/icons/ExploreIcon";
import HomeIcon from "@/assets/icons/HomeIcon";
import ProfileIcon from "@/assets/icons/ProfileIcon";
import SavedIcon from "@/assets/icons/SavedIcon";

const ICON_MAP: Record<string, any> = {
  index: HomeIcon,
  explore: ExploreIcon,
  saved: SavedIcon,
  profile: ProfileIcon,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
      tabBar={(props) => <FloatingPillNavbar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function FloatingPillNavbar({ state, navigation }: any) {
  const transition = useSharedValue(0);

  useEffect(() => {
    transition.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const animatedColors = useDerivedValue(() => {
    const c1 = interpolateColor(
      transition.value,
      [0, 0.5, 1],
      [
        "rgba(0, 255, 255, 0.9)",
        "rgba(255, 0, 255, 0.9)",
        "rgba(173, 255, 47, 0.9)",
      ],
    );
    const c2 = interpolateColor(
      transition.value,
      [0, 0.5, 1],
      [
        "rgba(0, 0, 255, 0.9)",
        "rgba(255, 255, 0, 0.9)",
        "rgba(255, 0, 0, 0.9)",
      ],
    );
    return [c1, c2];
  });

  return (
    <View className="absolute bottom-10 left-0 right-0 items-center">
      <View className="flex-row items-center rounded-full border-[1px] border-transparent overflow-hidden shadow-2xl w-[320px] h-[80px]">
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={320} height={80}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(320, 80)}
              colors={animatedColors}
            />
          </Rect>
        </Canvas>
        <BlurView
          intensity={40}
          tint="light"
          style={StyleSheet.absoluteFill}
          className="flex-row items-center justify-center"
        >
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;

            return (
              <TabButton
                key={route.key}
                routeName={route.name}
                isFocused={isFocused}
                onPress={() => {
                  if (!isFocused) {
                    navigation.navigate(route.name);
                  }
                }}
              />
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

function TabButton({ routeName, isFocused, onPress }: any) {
  const IconComponent = ICON_MAP[routeName] || HomeIcon;

  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 150 });
  }, [scale, isFocused]);

  const rStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    const backgroundColor = interpolateColor(
      scale.value,
      [0, 1],
      ["transparent", "#000000"],
    );

    return {
      backgroundColor,
      borderWidth: interpolate(scale.value, [0, 1], [0, 0.5]),
      borderColor: "rgba(255,255,255,0.15)",
      transform: [{ scale: scaleValue }],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      className="flex-1 items-center rounded-full h-full justify-center"
    >
      <Animated.View
        style={rStyle}
        className="w-14 h-14 rounded-full items-center justify-center"
      >
        <IconComponent color={isFocused ? "#FFFFFF" : "#1A1A1A"} size={24} />
      </Animated.View>
    </TouchableOpacity>
  );
}
