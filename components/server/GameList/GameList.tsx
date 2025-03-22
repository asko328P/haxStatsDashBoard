"use server";

import "server-only";

import { supabase } from "@/actions/render-info";
import GamesFlatList, {
  Game,
} from "@/components/client/GamesFlatList/GamesFlatList";

export default async function GameList() {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
        *,
        players:game_player!inner (
            id:player_id, team:team_id, player:players!player_id(name, created_at)),
            game_goals:goals!inner(player_id, is_own_goal, time, game_player!inner(team_id))
        )
    `,
    )
    // .select(
    //   `
    //     *,
    //     red_goals:goals!inner(*)
    // `,
    // )
    // .eq("game_player.team", 1)
    .order("team_id", {
      referencedTable: "game_player",
    })
    .order("id", {
      ascending: false,
    })
    .overrideTypes<Array<Game>>();

  console.log("data: ", data);
  console.log("error", error);
  if (!data) return;

  return <GamesFlatList games={data} />;
}
