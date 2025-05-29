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
import { Goal, HeatmapData } from "@/components/server/GameList/GameList";
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
import { useMemo, useRef, useState } from "react";
import Animated, { interpolate } from "react-native-reanimated";
import { interpolateColor } from "react-native-reanimated/src";

type Props = {
  style?: ViewStyle;
  heatmapData: HeatmapData;
  rows?: number;
  cols?: number;
  nameFilter?: string;
  goals?: Goal[];
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HeatMap = ({
  style,
  heatmapData,
  rows = 10,
  cols = 20,
  nameFilter,
  goals,
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

  const goalDots = useMemo(() => {
    const goalData = goals?.map((goal) => {
      return goal.heatmap?.flatMap((list) => {
        return list.filter(({ name, position, team, isBall }) => {
          return isBall;
        });
      });
    });

    console.log("goaldata:", goalData);
    return goalData?.flatMap((dots) => {
      return dots?.map((item, index, array) => {
        if (index === 0) {
          return;
        }

        const distance = Math.sqrt(
          Math.pow(item.position.x - array[index - 1].position.x, 2) +
            Math.pow(item.position.y - array[index - 1].position.y, 2),
        );

        return (
          <Line
            x1={item.position.x}
            y1={item.position.y}
            x2={array[index - 1].position.x}
            y2={array[index - 1].position.y}
            stroke={interpolateColor(
              distance,
              [0, 25],
              ["rgb(4,255,23)", "rgb(255,26,60)"],
            )}
            strokeWidth="2"
          />
        );
        // return (
        //   <Path
        //     d={`M${item.position.x}${item.position.y} ${array[index - 1].position.x}${array[index - 1].position.y}`}
        //     stroke={"red"}
        //     strokeWidth={1}
        //   />
        // );
      });
    });
  }, []);

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
        <G>{goalDots}</G>
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
