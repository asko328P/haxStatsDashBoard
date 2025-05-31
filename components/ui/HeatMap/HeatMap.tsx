import {
  Image,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Game, Goal, HeatmapData } from "@/components/server/GameList/GameList";
import { implementedMaps } from "@/assets/maps/implementedMaps";
import Svg, {
  Circle,
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  Line,
  Path,
  Rect,
} from "react-native-svg";
import { useEffect, useMemo, useRef, useState } from "react";
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { interpolateColor } from "react-native-reanimated/src";
import AnimatedBall from "@/components/ui/HeatMap/AnimatedBall";
import MapIcon from "@/components/ui/HeatMap/MapIcon/MapIcon";
import gameItem from "@/components/ui/GameItem/GameItem";

type Props = {
  style?: ViewStyle;
  heatmapData: HeatmapData;
  gameItem: Game;
  rows?: number;
  cols?: number;
  nameFilter?: string;
  sharedProgressValue: SharedValue<number>;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedGroup = Animated.createAnimatedComponent(G);

const HeatMap = ({
  gameItem,
  style,
  heatmapData,
  rows = 10,
  cols = 20,
  nameFilter,
  sharedProgressValue,
}: Props) => {
  if (!implementedMaps[heatmapData.map_name]) {
    return;
  }
  const stadium: { width: number; height: number; image: any } =
    implementedMaps[heatmapData.map_name];

  const shouldSetLayout = useRef<boolean>(true);

  const [layout, setLayout] = useState<LayoutRectangle>();

  const layoutHandler = (layout: LayoutRectangle) => {
    setLayout(layout);
  };

  const heatmapBlocks = useMemo(() => {
    let valuesArray: number[][] = new Array(rows)
      .fill(0)
      .map(() => new Array(cols).fill(0));
    let maxValue = 0;

    let teamColor = 0;

    heatmapData.heatmap.forEach((list) => {
      list.forEach(({ name, position, team }) => {
        if (nameFilter) {
          if (name !== nameFilter) {
            return;
          }
          teamColor = team;
        }
        if (team === 0) {
          return;
        }
        let posRow = Math.floor(
          (position.y + stadium.height) / ((stadium.height * 2) / rows),
        );
        let posCol = Math.floor(
          (position.x + stadium.width) / ((stadium.width * 2) / cols),
        );
        valuesArray[posRow][posCol] += 1;
        if (valuesArray[posRow][posCol] > maxValue) {
          maxValue = valuesArray[posRow][posCol];
        }
      });
    });

    return valuesArray.map((col, i) => {
      return col.map((value, j) => {
        return (
          <Rect
            key={`${heatmapData.id}${i}${j}`}
            x={(j * 2 * stadium.width) / cols - stadium.width}
            y={(i * 2 * stadium.height) / rows - stadium.height}
            width={(stadium.width / cols) * 2}
            height={(stadium.height / rows) * 2}
            fill={interpolateColor(
              value,
              [0, maxValue / 3, maxValue],
              teamColor === 0
                ? [
                    "rgba(126,255,0,0)",
                    "rgba(194,253,42,0.4)",
                    "rgba(255,26,26, 1)",
                  ]
                : teamColor === 1
                  ? [
                      "rgba(249,255,37,0)",
                      "rgba(253,148,42,0.4)",
                      "rgba(255,57,57,1)",
                    ]
                  : [
                      "rgba(16,255,136,0)",
                      "rgba(94,255,255,0.4)",
                      "rgba(170,214,255,0.6)",
                    ],
            )}
          />
        );
      });
    });
  }, [nameFilter]);

  const positionsInCurrentMoment = useDerivedValue(() => {
    return heatmapData.heatmap[Math.floor(sharedProgressValue.value)];
  });

  // const animatedPositionProps = useAnimatedProps(() => {
  //   return {
  //     children: <Text children={"asd"} />,
  //   };
  // });

  return (
    <View
      onLayout={(e) => layoutHandler(e.nativeEvent.layout)}
      style={[
        {
          height: layout?.width
            ? (layout?.width * stadium.height) / stadium.width
            : 0,
        },
        styles.container,
        style,
      ]}
    >
      <Image
        style={{
          position: "absolute",
          width: "100%",
          height: layout?.width
            ? (layout?.width * stadium.height) / stadium.width
            : 0,
        }}
        source={stadium.image}
      />
      <Svg
        style={{ position: "absolute" }}
        viewBox={`-${stadium.width} -${stadium.height} ${stadium.width * 2} ${stadium.height * 2} `}
        width={layout?.width}
        height={
          layout?.width ? (layout?.width! * stadium.height) / stadium.width : 0
        }
      >
        <Filter id="myFilter">
          <FeGaussianBlur stdDeviation={24} />
        </Filter>
        <Filter id="myFilter2">
          <FeGaussianBlur stdDeviation={18} />
        </Filter>
        <G filter={"url(#myFilter)"}>{heatmapBlocks}</G>
        <G filter={"url(#myFilter2)"}>{heatmapBlocks}</G>
        {/*<G key={sharedProgressValue.value}>{positionsInCurrentMoment.value}</G>*/}
        <G>
          {gameItem.game_player.map((item) => {
            return (
              <MapIcon
                key={item.id}
                name={item.id}
                heatmapData={heatmapData}
                sharedProgressValue={sharedProgressValue}
              />
            );
          })}
          <MapIcon
            name={"ball"}
            heatmapData={heatmapData}
            sharedProgressValue={sharedProgressValue}
          />
        </G>
        {/*<AnimatedGroup animatedProps={animatedPositionProps} />*/}
        {/*<G>{goalDots}</G>*/}
        {/*<G>*/}
        {/*  {goalData?.map((item) => {*/}
        {/*    if (!item) {*/}
        {/*      return;*/}
        {/*    }*/}
        {/*    return (*/}
        {/*      <AnimatedBall*/}
        {/*        positionArray={item}*/}
        {/*        sharedAnimationProgress={sharedAnimationProgress}*/}
        {/*      />*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</G>*/}

        {/*<AnimatedCircle*/}
        {/*  x={0}*/}
        {/*  y={0}*/}
        {/*  r={6}*/}
        {/*  fill={"white"}*/}
        {/*  strokeWidth={1.5}*/}
        {/*  stroke={"black"}*/}
        {/*/>*/}
      </Svg>
    </View>
  );
};

export default HeatMap;

const styles = StyleSheet.create({
  container: {
    minWidth: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
});
