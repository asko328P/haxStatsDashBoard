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
import React, { useState } from "react";
import PlayerInfo from "@/components/server/PlayerInfo/PlayerInfo";
import { AntDesign } from "@expo/vector-icons";

const GameLimitTouchable = ({
  id,
  selectedId,
  onPress,
}: {
  id: number;
  selectedId: number;
  onPress: () => void;
}) => {
  const isSelected = id === selectedId;
  return (
    <TouchableOpacity
      style={[
        styles.lastGamesTouchable,
        {
          backgroundColor: isSelected ? "#c6c6c6" : "#252525",
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 15,
          lineHeight: 15,
          color: isSelected ? "#000000" : "#efefef",
        }}
      >
        {id}
      </Text>
    </TouchableOpacity>
  );
};

const SelectedPlayerHolder = () => {
  const playerId = useSelectedPlayerStore((state) => state.id);
  const setSelectedPlayerId = useSelectedPlayerStore((state) => state.set);

  const [gameLimit, setGameLimit] = useState(5);

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
      <View
        style={{
          alignItems: "center",
          gap: 10,
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 16,
        }}
      >
        <Text style={styles.lastGamesText}>{"Last"}</Text>
        <GameLimitTouchable
          id={5}
          selectedId={gameLimit}
          onPress={() => setGameLimit(5)}
        />
        <GameLimitTouchable
          id={10}
          selectedId={gameLimit}
          onPress={() => setGameLimit(10)}
        />
        <GameLimitTouchable
          id={15}
          selectedId={gameLimit}
          onPress={() => setGameLimit(15)}
        />
        <Text style={styles.lastGamesText}>{"games"}</Text>
      </View>
      <Text style={styles.text}>{`Last ${gameLimit} matches:`}</Text>

      <ScrollView style={styles.playerInfoHolder}>
        <React.Suspense
          fallback={
            // The view that will render while the Server Function is awaiting data.
            <ActivityIndicator />
          }
        >
          {PlayerInfo({ playerId, gameLimit })}
          {/*<PlayerInfo playerId={selectedPlayerId} />*/}
        </React.Suspense>
      </ScrollView>
    </View>
  );
};

export default SelectedPlayerHolder;

const styles = StyleSheet.create({
  lastGamesTouchable: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  lastGamesText: {
    color: "#d6d6d6",
    fontSize: 14,
  },
  text: {
    color: "#fff",
  },
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
