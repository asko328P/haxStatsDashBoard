import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Game } from "@/components/server/GameList/GameList";
import GameItem from "@/components/ui/GameItem/GameItem";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomActivityIndicator from "@/components/CustomActivityIndicator/CustomActivityIndicator";

const FIRST_RANGE_LIMIT = 5;
const SECOND_RANGE_LIMIT = 30;

const AllGamesFlatList = () => {
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
    <FlatList
      ListEmptyComponent={<CustomActivityIndicator />}
      showsHorizontalScrollIndicator={false}
      maxToRenderPerBatch={5}
      contentContainerStyle={styles.contentContainer}
      data={gamesData}
      renderItem={({ item }) => <GameItem gameItem={item} />}
    />
  );
};

export default AllGamesFlatList;

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 16,
    gap: 16,
  },
});
