"use server";

import "server-only";

import { supabase } from "@/actions/render-info";
import PlayerInfoDetails from "@/components/client/PlayerInfoDetails/PlayerInfoDetails";

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
      games!inner(*, goals!inner(*), game_player!left(*))
    `,
    )
    .eq("id", playerId)
    .or(`player_id.eq.${playerId?.toString()}`, {
      referencedTable: "games.goals",
    })
    .or(`player_id.eq.${playerId?.toString()}`, {
      referencedTable: "games.game_player",
    })
    .limit(gameLimit, { referencedTable: "games" })
    .maybeSingle()
    .overrideTypes<PlayerInfo>();

  console.log(error);
  if (!data) return;

  // return <Text style={{ color: "white" }}>{"huh"}</Text>;

  return <PlayerInfoDetails player={data} gameLimit={gameLimit} />;
}
