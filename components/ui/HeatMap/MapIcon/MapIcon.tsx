import { View } from "react-native";
import {
  HeatmapData,
  HeatPlayerPosition,
} from "@/components/server/GameList/GameList";
import { Circle, G, Text } from "react-native-svg";
import Animated, {
  interpolate,
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
  const previousTick = useDerivedValue(() => {
    return Math.floor(sharedProgressValue.value);
  });
  const currentTick = useDerivedValue(() => {
    return Math.floor(sharedProgressValue.value) + 1;
  });

  const positionInPreviousMoment = useDerivedValue(() => {
    return heatmapData.heatmap[previousTick.value].filter((item) => {
      return item.name === name;
    })[0];
  });

  const positionInCurrentMoment = useDerivedValue(() => {
    return heatmapData.heatmap[currentTick.value]?.filter((item) => {
      return item.name === name;
    })[0];
  });

  if (!positionInCurrentMoment.value?.position?.x) {
    return;
  }

  const interpolatedX = useDerivedValue(() => {
    return interpolate(
      sharedProgressValue.value,
      [previousTick.value, currentTick.value],
      [
        positionInPreviousMoment.value.position.x,
        positionInCurrentMoment.value.position.x,
      ],
    );
  });

  const interpolatedY = useDerivedValue(() => {
    return interpolate(
      sharedProgressValue.value,
      [previousTick.value, currentTick.value],
      [
        positionInPreviousMoment.value.position.y,
        positionInCurrentMoment.value.position.y,
      ],
    );
  });

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      cx: interpolatedX.value,
      cy: interpolatedY.value,
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
      x: interpolatedX.value,
      y: interpolatedY.value + 30,
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
