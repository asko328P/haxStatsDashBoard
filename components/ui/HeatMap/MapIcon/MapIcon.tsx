import { View } from "react-native";
import {
  HeatmapData,
  HeatPlayerPosition,
} from "@/components/server/GameList/GameList";
import { Circle, G, Text } from "react-native-svg";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";

type Props = {
  name: string;
  heatmapData: HeatmapData;
  sharedProgressValue: SharedValue<number>;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const MapIcon = ({ name, heatmapData, sharedProgressValue }: Props) => {
  const positionInCurrentMoment = useDerivedValue(() => {
    return heatmapData.heatmap[Math.floor(sharedProgressValue.value)].filter(
      (item) => {
        return item.name === name;
      },
    )[0];
  });

  if (!positionInCurrentMoment.value?.position?.x) {
    return;
  }

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      cx: positionInCurrentMoment.value.position.x,
      cy: positionInCurrentMoment.value.position.y,
      r: positionInCurrentMoment.value.isBall ? 6 : 15,
      fill:
        positionInCurrentMoment.value.team === 0
          ? "#FFFFFF"
          : positionInCurrentMoment.value.team === 1
            ? "#dd4444"
            : "#4ca3d8",
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
      x: positionInCurrentMoment.value.position.x,
      y: positionInCurrentMoment.value.position.y + 30,
    };
  });

  return (
    <G>
      <AnimatedCircle
        animatedProps={animatedCircleProps}
        strokeWidth={1.4}
        stroke={"black"}
      />
      {name !== "ball" && (
        <AnimatedText
          fontFamily={"Verdana"}
          fill={"white"}
          animatedProps={animatedTextProps}
          children={name}
          textAnchor={"middle"}
        />
      )}
    </G>
  );
};

export default MapIcon;
