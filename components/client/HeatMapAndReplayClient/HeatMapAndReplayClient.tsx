"use client";

import { View } from "react-native";
import { Game } from "@/components/server/GameList/GameList";
import GameItem from "@/components/ui/GameItem/GameItem";

type Props = {
  data: Game;
};

const HeatMapAndReplayClient = ({ data }: Props) => {
  return <GameItem gameItem={data} />;
};

export default HeatMapAndReplayClient;
