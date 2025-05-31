import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  sharedProgressValue: SharedValue<number>;
  maxValue: number;
};

const ProgressBar = ({ sharedProgressValue, maxValue }: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(sharedProgressValue.value, [0, maxValue], [0, 100])}%`,
    };
  });
  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, styles.progressBar]}>
        <View style={styles.circle} />
      </Animated.View>
    </View>
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
