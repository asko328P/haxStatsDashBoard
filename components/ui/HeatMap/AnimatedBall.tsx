import { View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";
import { Circle } from "react-native-svg";
import { HeatPlayerPosition } from "@/components/server/GameList/GameList";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  sharedAnimationProgress: SharedValue<number>;
  positionArray: HeatPlayerPosition[];
};
const AnimatedBall = ({ sharedAnimationProgress, positionArray }: Props) => {
  if (!positionArray[0]?.position?.x) {
    return;
  }
  const derivedX = useDerivedValue(() => {
    return positionArray[
      Math.floor(
        interpolate(
          sharedAnimationProgress.value,
          [0, 1],
          [0, positionArray.length - 1],
        ),
      )
    ].position.x;
  });

  const derivedY = useDerivedValue(() => {
    return positionArray[
      Math.floor(
        interpolate(
          sharedAnimationProgress.value,
          [0, 1],
          [0, positionArray.length - 1],
        ),
      )
    ].position.y;
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      cx: derivedX.value,
      cy: derivedY.value,
    };
  });
  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      r={6}
      fill={"white"}
      strokeWidth={1.5}
      stroke={"black"}
    />
  );
};

export default AnimatedBall;
