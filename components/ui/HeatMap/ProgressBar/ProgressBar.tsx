import {
  LayoutRectangle,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  FadeInUp,
  FadeOutDown,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useState } from "react";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Game, Goal } from "@/components/server/GameList/GameList";
import gameItem from "@/components/ui/GameItem/GameItem";

type Props = {
  gameItem: Game;
  goals: Goal[];
  startGameAnimation: () => void;
  cancelGameAnimation: () => void;
  sharedProgressValue: SharedValue<number>;
  maxValue: number;
  shouldShowPlayButton: boolean;
  handlePlayPress: () => void;
};

const CIRCLE_SIZE = 9;

const ProgressBar = ({
  gameItem,
  goals,
  startGameAnimation,
  cancelGameAnimation,
  sharedProgressValue,
  maxValue,
  shouldShowPlayButton,
  handlePlayPress,
}: Props) => {
  const [layout, setLayout] = useState<LayoutRectangle>();
  const layoutHandler = (layout: LayoutRectangle) => {
    setLayout(layout);
  };

  const pressHandler = (e: any) => {
    if (e.nativeEvent.offsetX < CIRCLE_SIZE) {
      return;
    }
    const seekingValue = interpolate(
      e.nativeEvent.offsetX,
      [0, layout?.width!],
      [0, maxValue],
    );
    cancelGameAnimation();
    sharedProgressValue.value = seekingValue;
    startGameAnimation();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(sharedProgressValue.value, [0, maxValue], [0, 100], Extrapolation.CLAMP)}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.playButtonHolder}>
        <TouchableOpacity
          onPress={handlePlayPress}
          style={styles.playPauseButton}
        >
          <Animated.View
            key={`${shouldShowPlayButton}`}
            entering={FadeInUp}
            exiting={FadeOutDown}
          >
            <FontAwesome6
              name={shouldShowPlayButton ? "play" : "pause"}
              size={16}
              color={"#dfdfdf"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onLayout={(e) => layoutHandler(e.nativeEvent.layout)}
        onPress={(e) => pressHandler(e)}
        style={{ paddingVertical: 5, flex: 1 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            style={{
              opacity: 0,
            }}
            name="football-outline"
            size={20}
            color={"#4c4c4c"}
          />
          {goals.map((goal, index) => (
            <Ionicons
              style={[
                { position: "absolute" },
                {
                  left: `${interpolate(goal.time, [0, gameItem.time], [0, 100])}%`,
                  transform: [{ translateX: -10 }],
                },
              ]}
              name="football-outline"
              size={20}
              color={"#4c4c4c"}
            />
          ))}
        </View>

        <View style={styles.progressContainer}>
          <Animated.View style={[animatedStyle, styles.progressBar]}>
            <View style={styles.circle} />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  playPauseButton: {
    overflow: "hidden",
    paddingVertical: 4,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#393939",
    borderRadius: 4,
  },
  playButtonHolder: {
    alignItems: "flex-start",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 3.5,
    backgroundColor: "#FFFFFF",
  },
  progressBar: {
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#ea3030",
    height: 5,
    borderRadius: 5,
  },
  progressContainer: {
    backgroundColor: "#3c3c3c",
    borderRadius: 10,
    flexDirection: "row",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
});
