"use client";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { convertMiliseconds, dateToString } from "@/utility/utilityFunctions";
import { useEffect, useMemo } from "react";
import { useSelectedPlayerStore } from "@/zustand/selectedPlayer/selectedPlayerSlice";
import { Game } from "@/components/server/GameList/GameList";
import HeatMap from "@/components/ui/HeatMap/HeatMap";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import GameItem from "@/components/ui/GameItem/GameItem";

type Props = {
  games: Game[] | null;
};

const RED_COLOR = "#ff2525";
const BLUE_COLOR = "#2196df";
const BRIGHT_RED_COLOR = "#fbcdc8";
const DARK_BLUE_COLOR = "#07273a";

const GamesFlatList = ({ games }: Props) => {
  const selectedPlayerId = useSelectedPlayerStore((state) => state.id);
  const setSelectedPlayerId = useSelectedPlayerStore((state) => state.set);
  const handlePlayerPress = (id: string) => {
    setSelectedPlayerId(id);
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      maxToRenderPerBatch={5}
      contentContainerStyle={styles.contentContainer}
      data={games}
      renderItem={({ item }) => <GameItem gameItem={item} />}
    />
  );
};

export default GamesFlatList;

const styles = StyleSheet.create({
  heatMapHolder: {
    alignItems: "center",
  },
  goalPlayerName: {
    textAlign: "center",
  },
  gameIdText: {
    fontStyle: "italic",
    fontSize: 9,
    color: "#404040",
    lineHeight: 9,
    // flex: 1,
    textAlign: "right",
  },
  player: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 3,
    fontWeight: "500",
  },
  ball: { lineHeight: 14, fontSize: 14 },
  goal: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 5,
    maxWidth: 300,
    // minWidth: 150,
    backgroundColor: "#2c2c2c",
    width: "100%",
    alignItems: "center",
  },
  separator: {
    width: "40%",
    maxWidth: 150,
    borderTopColor: "#757575",
    borderTopWidth: 1,
  },
  playersHolder: {
    // backgroundColor: "#2b2b2b",
    gap: 5,
    borderRadius: 10,
  },
  goalsHolder: {
    // maxWidth: 200,
    minWidth: 150,
    gap: 5,
    flex: 1,
    alignItems: "center",
  },
  bottomHolder: {
    gap: 16,
    flexDirection: "row",
    flexWrap: "wrap-reverse",
  },
  contentContainer: {
    paddingTop: 16,
    gap: 16,
  },
  text: {
    color: "white",
  },
  renderItem: {
    gap: 10,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#333333",
    padding: 16,
    paddingTop: 5,
  },
});
