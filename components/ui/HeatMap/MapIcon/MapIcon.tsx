import { View } from "react-native";
import {
  HeatmapData,
  HeatPlayerPosition,
} from "@/components/server/GameList/GameList";
import { Circle } from "react-native-svg";
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

  const animatedProps = useAnimatedProps(() => {
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

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      strokeWidth={1.4}
      stroke={"black"}
    />
  );
};

export default MapIcon;
