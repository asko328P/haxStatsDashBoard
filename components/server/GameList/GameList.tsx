"use server";

import "server-only";

import { supabase } from "@/actions/render-info";
import GamesFlatList from "@/components/client/GamesFlatList/GamesFlatList";

export type Game = {
  id: number;
  created_at: string;
  ended_at: string;
  time?: number;
  winning_team_id: number;
  game_player: {
    id: string;
    team: number;
    player: {
      id: string;
      created_at: string;
    };
  }[];
  goals: {
    id: number;
    time?: number;
    player_id: string;
    game_player: {
      team_id: number;
    };
    is_own_goal: boolean;
  }[];
};

export default async function GameList() {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
        *,
        game_player!inner (
            id:player_id, team:team_id, players!player_id(id, created_at)),
            goals!inner(player_id, is_own_goal, time, id, game_player!inner(team_id))
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
