"use server";

import "server-only";

import { supabase } from "@/actions/render-info";
import PlayerInfoDetails from "@/components/client/PlayerInfoDetails/PlayerInfoDetails";

const HARD_LIMIT = 40;

export type PlayerInfo = {
  id: string;
  created_at: string;
  name: string;
  games: {
    id: number;
    created_at: string;
    winning_team_id: number;
    time: number;
    goals: {
      id: number;
      time: null;
      created_at: string;
      is_own_goal: false;
      goal_for_team_id: null;
    }[];
    assists: {
      id: number;
      time: null;
      created_at: string;
      is_own_goal: false;
      goal_for_team_id: null;
    }[];
    game_player: [
      {
        team_id: number;
      },
    ];
  }[];
};

export default async function PlayerInfo({
  playerId,
  gameLimit = 5,
}: {
  playerId: string | undefined;
  gameLimit?: number;
}) {
  const { data, error } = await supabase
    .from("players")
    .select(
      `*,
      games!inner(*, goals!left(*), assists:goals!left(*), game_player!inner(*))   
    `,
    )
    .eq("id", playerId)
    // .or(`player_id.eq.${playerId?.toString()}`, {
    //   referencedTable: "games.goals",
    // })
    .or(`player_id.eq.${playerId?.toString()}`, {
      referencedTable: "games.game_player",
    })
    .eq("games.assists.assist_player_id", playerId?.toString())
    .eq("games.goals.player_id", playerId?.toString())

    // .or(`assist_player_id.eq.${playerId?.toString()}`, {
    //   referencedTable: "games.assists",
    // })
    // .filter("games.assists.assist_player_id", "eq", playerId?.toString())
    .limit(gameLimit < HARD_LIMIT ? gameLimit : HARD_LIMIT, {
      referencedTable: "games",
    })
    .order("id", {
      referencedTable: "games",
      ascending: false,
    })
    .maybeSingle()
    .overrideTypes<PlayerInfo>();

  // console.log(error);
  if (!data) return;

  // return <Text style={{ color: "white" }}>{"huh"}</Text>;

  //@ts-ignore experimental
  return <PlayerInfoDetails player={data} gameLimit={gameLimit} />;
}
