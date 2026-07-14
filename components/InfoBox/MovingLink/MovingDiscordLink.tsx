import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";

const MovingGithubLink = () => {
  const [linkVisible, setLinkVisible] = useState(false);

  const handleLink = () => {};

  const sharedAnimationValue = useSharedValue(0);
  const sharedTextOpacityValue = useSharedValue(0);

  useEffect(() => {
    sharedAnimationValue.value = withRepeat(
      withTiming(10, {
        duration: 1000 * 12,
      }),
      -1,
    );
  }, []);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: sharedTextOpacityValue.value,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        sharedAnimationValue.value,
        [0, 4, 5, 6, 10],
        [0.5, 0.9, 1, 0.9, 0.5],
      ),
      transform: [
        {
          rotateZ: `${interpolate(sharedAnimationValue.value, [0, 4, 5, 6, 10], [0, 0, 360, 360, 360])}deg`,
        },
      ],
    };
  });

  return (
    <View
      style={styles.container}
      onPointerEnter={() => {
        sharedTextOpacityValue.value = withTiming(1);
      }}
      onPointerLeave={() => {
        sharedTextOpacityValue.value = withTiming(0);
      }}
    >
      <Animated.View style={animatedTextStyle}>
        <ThemedText onPress={handleLink} style={styles.link}>
          {"_asko_"}
        </ThemedText>
      </Animated.View>

      <Animated.View
        style={animatedIconStyle}
        layout={LinearTransition.duration(300)}
      >
        <FontAwesome6 name="discord" size={24} color={"#FFFFFF"} />
      </Animated.View>
    </View>
  );
};

export default MovingGithubLink;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  link: {
    textDecorationLine: "underline",
    color: "#8c8c8c",
    fontSize: 17,
  },
});
