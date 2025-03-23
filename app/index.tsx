/// <reference types="react/canary" />

import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import GameList from "@/components/server/GameList/GameList";
import { useSelectedPlayerStore } from "@/zustand/selectedPlayer/selectedPlayerSlice";
import SelectedPlayerHolder from "@/components/ui/SelectedPlayerHolder/SelectedPlayerHolder";

export default function Index() {
  const selectedPlayerId = useSelectedPlayerStore((state) => state.id);

  const memoizedGameList = useMemo(() => {
    return GameList();
  }, []);

  return (
    <View style={styles.container}>
      <React.Suspense
        fallback={
          // The view that will render while the Server Function is awaiting data.
          <ActivityIndicator />
        }
      >
        {/*{renderInfo({ name: 'World' })}*/}
        <View style={styles.gameListHolder}>{memoizedGameList}</View>
      </React.Suspense>

      {selectedPlayerId && <SelectedPlayerHolder />}
    </View>
  );
}

const styles = StyleSheet.create({
  gameListHolder: {
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#333333",
    minWidth: "50%",
    maxWidth: 700,
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
    // alignItems: "center",
    maxHeight: "100%",
  },
});
