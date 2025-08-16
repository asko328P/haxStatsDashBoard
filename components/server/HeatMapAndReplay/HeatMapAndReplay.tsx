"use server";

import "server-only";

import { supabase } from "@/actions/render-info";
import { Game } from "@/components/server/GameList/GameList";
import HeatMapAndReplayClient from "@/components/client/HeatMapAndReplayClient/HeatMapAndReplayClient";

export default async function HeatMapAndReplay({ id }: { id: number }) {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
        *,
        game_player!inner (
            id:player_id, team:team_id, players!player_id(id, created_at)),
            goals!inner(player_id, assist_player_id, is_own_goal, time, id, game_player!inner(team_id)),
            heatmaps!left(*)
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
    .eq("id", id)
    .order("team_id", {
      referencedTable: "game_player",
    })
    .order("id", {
      ascending: false,
    })
    .order("id", { referencedTable: "goals", ascending: false })
    .limit(1)
    .single()
    .overrideTypes<Game>();

  // console.log("data: ", data);
  // console.log("error", error);
  if (!data) return;

  return <HeatMapAndReplayClient data={data} />;
}
