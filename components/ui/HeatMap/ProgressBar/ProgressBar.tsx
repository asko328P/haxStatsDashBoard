import {
  GestureResponderEvent,
  LayoutRectangle,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useState } from "react";

type Props = {
  startGameAnimation: () => void;
  cancelGameAnimation: () => void;
  sharedProgressValue: SharedValue<number>;
  maxValue: number;
};

const ProgressBar = ({
  startGameAnimation,
  cancelGameAnimation,
  sharedProgressValue,
  maxValue,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(sharedProgressValue.value, [0, maxValue], [0, 100])}%`,
    };
  });

  const [layout, setLayout] = useState<LayoutRectangle>();

  const pressHandler = (e: any) => {
    const seekingValue = interpolate(
      e.nativeEvent.layerX,
      [0, layout?.width!],
      [0, maxValue],
    );
    cancelGameAnimation();
    sharedProgressValue.value = seekingValue;
    startGameAnimation();
  };

  const layoutHandler = (layout: LayoutRectangle) => {
    setLayout(layout);
  };

  return (
    <TouchableOpacity
      onLayout={(e) => layoutHandler(e.nativeEvent.layout)}
      onPress={(e) => pressHandler(e)}
      style={{ paddingVertical: 5 }}
    >
      <View style={styles.container}>
        <Animated.View style={[animatedStyle, styles.progressBar]}>
          <View style={styles.circle} />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  circle: {
    width: 9,
    height: 9,
    borderRadius: 3.5,
    backgroundColor: "#FFFFFF",
  },
  progressBar: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    backgroundColor: "#ea3030",
    height: 5,
    borderRadius: 5,
  },
  container: {
    backgroundColor: "#3c3c3c",
    borderRadius: 10,
    flexDirection: "row",
  },
});
