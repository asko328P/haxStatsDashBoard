/// <reference types="react/canary" />

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import GameList, { Game } from "@/components/server/GameList/GameList";
import { useSelectedPlayerStore } from "@/zustand/selectedPlayer/selectedPlayerSlice";
import SelectedPlayerHolder from "@/components/ui/SelectedPlayerHolder/SelectedPlayerHolder";
import { supabase } from "@/lib/supabase";
import AllGamesFlatList from "@/components/AllGamesFlatList/AllGamesFlatList";
import InfoBox from "@/components/InfoBox/InfoBox";

const FIRST_RANGE_LIMIT = 5;
const SECOND_RANGE_LIMIT = 30;

export default function Index() {
  const selectedPlayerId = useSelectedPlayerStore((state) => state.id);

  return (
    <View style={styles.container}>
      <InfoBox />
      <AllGamesFlatList />
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
    paddingHorizontal: 0,
    // alignItems: "center",
    maxHeight: "100%",
  },
});
