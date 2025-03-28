import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { HeatmapData } from "@/components/server/GameList/GameList";
import { implementedMaps } from "@/assets/maps/implementedMaps";
import Svg, { Circle, FeGaussianBlur, Filter, Rect } from "react-native-svg";
import { useMemo } from "react";
import { interpolate } from "react-native-reanimated";
import { interpolateColor } from "react-native-reanimated/src";

type Props = {
  style?: ViewStyle;
  heatmapData: HeatmapData;
  rows?: number;
  cols?: number;
  nameFilter?: string;
};

const HeatMap = ({
  style,
  heatmapData,
  rows = 10,
  cols = 20,
  nameFilter,
}: Props) => {
  // @ts-ignore
  if (!implementedMaps[heatmapData.map_name]) {
    return;
  }
  const stadium: { width: number; height: number; image: any } =
    // @ts-ignore
    implementedMaps[heatmapData.map_name];

  const heatmapBlocks = useMemo(() => {
    let valuesArray: number[][] = new Array(rows)
      .fill(0)
      .map(() => new Array(cols).fill(0));
    let maxValue = 0;

    heatmapData.heatmap.forEach((list) => {
      list.forEach(({ name, position }) => {
        if (nameFilter) {
          if (name !== nameFilter) {
            return;
          }
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
            key={`${i}-${j}${value}`}
            x={(j * 2 * stadium.width) / cols - stadium.width}
            y={(i * 2 * stadium.height) / rows - stadium.height}
            width={(stadium.width / cols) * 2}
            height={(stadium.height / rows) * 2}
            fill={interpolateColor(
              value,
              [0, maxValue / 2, maxValue],
              [
                "rgba(126,255,0,0)",
                "rgba(194,253,42,0.3)",
                "rgba(255,26,26, 0.8)",
              ],
            )}
            // stroke="red"
            // strokeWidth="2"
            // opacity={interpolate(value, [0, maxValue], [0, 1])}
          />
        );
      });
    });
  }, [nameFilter]);
  return (
    <View style={[styles.container, style]}>
      <Image
        style={{
          width: 400,
          height: (400 * stadium.height) / stadium.width,
        }}
        source={stadium.image}
      />
      <Svg
        style={{ position: "absolute" }}
        viewBox={`-${stadium.width} -${stadium.height} ${stadium.width * 2} ${stadium.height * 2} `}
        width={400}
        height={(400 * stadium.height) / stadium.width}
      >
        {heatmapBlocks}
      </Svg>
    </View>
  );
};

export default HeatMap;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
