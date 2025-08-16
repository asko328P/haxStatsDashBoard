/// <reference types="react/canary" />

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import GameList, { Game } from "@/components/server/GameList/GameList";
import { useSelectedPlayerStore } from "@/zustand/selectedPlayer/selectedPlayerSlice";
import SelectedPlayerHolder from "@/components/ui/SelectedPlayerHolder/SelectedPlayerHolder";
import { supabase } from "@/lib/supabase";
import AllGamesFlatList from "@/components/AllGamesFlatList/AllGamesFlatList";

const FIRST_RANGE_LIMIT = 5;
const SECOND_RANGE_LIMIT = 30;

export default function Index() {
  const selectedPlayerId = useSelectedPlayerStore((state) => state.id);

  const [gamesData, setGamesData] = useState<Game[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { data: firstDataSet, error } = await supabase
        .from("games")
        .select(
          `
        *,
        game_player!inner (
            id:player_id, team:team_id, players!player_id(id, created_at)),
            heatmaps!inner(*),
            goals!inner(player_id, assist_player_id, is_own_goal, time, id, game_player!inner(team_id))
            )
    `,
        )
        .not("ended_at", "is", null)
        .order("team_id", {
          referencedTable: "game_player",
        })
        .order("id", {
          ascending: false,
        })
        .order("id", { referencedTable: "goals", ascending: false })
        .range(0, FIRST_RANGE_LIMIT)
        .overrideTypes<Array<Game>>();

      const { data: secondDataSet } = await supabase
        .from("games")
        .select(
          `
        *,
        game_player!inner (
            id:player_id, team:team_id, players!player_id(id, created_at)),
            goals!inner(player_id, assist_player_id, is_own_goal, time, id, game_player!inner(team_id))
            )
    `,
        )
        .not("ended_at", "is", null)
        .order("team_id", {
          referencedTable: "game_player",
        })
        .order("id", {
          ascending: false,
        })
        .order("id", { referencedTable: "goals", ascending: false })
        .range(FIRST_RANGE_LIMIT + 1, SECOND_RANGE_LIMIT)
        .overrideTypes<Array<Game>>();

      setGamesData([...firstDataSet!, ...secondDataSet!]);
    };
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {/*<React.Suspense*/}
      {/*  fallback={*/}
      {/*    // The view that will render while the Server Function is awaiting data.*/}
      {/*    <ActivityIndicator />*/}
      {/*  }*/}
      {/*>*/}
      {/*  /!*{renderInfo({ name: 'World' })}*!/*/}
      {/*  <View style={styles.gameListHolder}>{memoizedGameList}</View>*/}
      {/*</React.Suspense>*/}

      {/*{selectedPlayerId && <SelectedPlayerHolder />}*/}

      <AllGamesFlatList games={gamesData} />
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
