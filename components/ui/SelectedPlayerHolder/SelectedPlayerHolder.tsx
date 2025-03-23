/// <reference types="react/canary" />

import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelectedPlayerStore } from "@/zustand/selectedPlayer/selectedPlayerSlice";
import React from "react";
import PlayerInfo from "@/components/server/PlayerInfo/PlayerInfo";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";

const SelectedPlayerHolder = () => {
  const playerId = useSelectedPlayerStore((state) => state.id);
  const setSelectedPlayerId = useSelectedPlayerStore((state) => state.set);

  const handleCloseButton = () => {
    setSelectedPlayerId(undefined);
  };
  return (
    <View style={styles.container}>
      <View style={styles.nameAndBackButtonHolder}>
        <Text style={styles.playerId}>{playerId}</Text>
        <TouchableOpacity onPress={handleCloseButton}>
          <View style={styles.backButton}>
            <AntDesign name="close" size={18} color={"#838383"} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      <ScrollView style={styles.playerInfoHolder}>
        <React.Suspense
          fallback={
            // The view that will render while the Server Function is awaiting data.
            <ActivityIndicator />
          }
        >
          {PlayerInfo({ playerId })}
          {/*<PlayerInfo playerId={selectedPlayerId} />*/}
        </React.Suspense>
      </ScrollView>
    </View>
  );
};

export default SelectedPlayerHolder;

const styles = StyleSheet.create({
  separator: {
    marginRight: 16,
    borderTopWidth: 1,
    borderTopColor: "#9f9f9f",
  },
  playerInfoHolder: {
    paddingRight: 16,
    maxWidth: 400,
  },
  playerId: {
    fontSize: 27,
    lineHeight: 28,
    color: "#f1f1f1",
  },
  nameAndBackButtonHolder: {
    gap: 10,
    paddingRight: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    alignSelf: "flex-end",
    backgroundColor: "#434343",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  container: {
    paddingRight: 0,
    gap: 10,
    padding: 16,
    height: "100%",
    right: 0,
    position: "absolute",
    backgroundColor: "#333333",
    maxWidth: "100%",
    flexShrink: 1,
  },
});
