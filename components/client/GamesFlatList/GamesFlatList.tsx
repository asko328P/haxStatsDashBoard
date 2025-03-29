"use client";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { convertMiliseconds, dateToString } from "@/utility/utilityFunctions";
import { useMemo } from "react";
import { useSelectedPlayerStore } from "@/zustand/selectedPlayer/selectedPlayerSlice";
import { Game } from "@/components/server/GameList/GameList";
import HeatMap from "@/components/ui/HeatMap/HeatMap";

type Props = {
  games: Game[] | null;
};

const RED_COLOR = "#ff2525";
const BLUE_COLOR = "#2196df";
const BRIGHT_RED_COLOR = "#fbcdc8";
const DARK_BLUE_COLOR = "#07273a";

const GamesFlatList = ({ games }: Props) => {
  const selectedPlayerId = useSelectedPlayerStore((state) => state.id);
  const setSelectedPlayerId = useSelectedPlayerStore((state) => state.set);
  const handlePlayerPress = (id: string) => {
    setSelectedPlayerId(id);
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      maxToRenderPerBatch={5}
      contentContainerStyle={styles.contentContainer}
      data={games}
      renderItem={({ item }) => {
        let redScore = 0;
        let blueScore = 0;
        item.goals.forEach((goal) => {
          if (goal.game_player.team_id === 1 && !goal.is_own_goal) {
            redScore += 1;
          }
          if (goal.game_player.team_id === 1 && goal.is_own_goal) {
            blueScore += 1;
          }
        });
        item.goals.forEach((goal) => {
          if (goal.game_player.team_id === 2 && !goal.is_own_goal) {
            blueScore += 1;
          }
          if (goal.game_player.team_id === 2 && goal.is_own_goal) {
            redScore += 1;
          }
        });

        let duration = "0:00";
        if (item.time) {
          duration = convertMiliseconds(Math.round(item.time * 1000));
        }

        return (
          <View key={item.id} style={styles.renderItem}>
            <Text style={styles.gameIdText}>{`game id: ${item.id}`}</Text>
            {/*<Text style={{ color: "red" }}>{JSON.stringify(item)}</Text>*/}

            <View style={styles.bottomHolder}>
              <View style={styles.playersHolder}>
                <Text style={{ color: "#9a9a9a" }}>{"Players: "}</Text>
                <View style={{ gap: 4 }}>
                  {item.game_player.map((player) => {
                    if (player.team === 0) {
                      return;
                    }
                    const playerGoals = item.goals.reduce((acc, cur) => {
                      return cur.player_id === player.id && !cur.is_own_goal
                        ? acc + 1
                        : acc;
                    }, 0);
                    return (
                      <TouchableOpacity
                        key={player.id}
                        onPress={() => handlePlayerPress(player.id)}
                        style={[
                          styles.player,
                          {
                            backgroundColor:
                              player.team === 1
                                ? RED_COLOR
                                : player.team === 2
                                  ? BLUE_COLOR
                                  : "#8e8479",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.text,
                            {
                              color:
                                player.team === 1
                                  ? BRIGHT_RED_COLOR
                                  : DARK_BLUE_COLOR,
                            },
                          ]}
                        >{`${player.id}: `}</Text>
                        <Text
                          style={{
                            flex: 1,
                            textAlign: "right",
                            color:
                              player.team === 1
                                ? BRIGHT_RED_COLOR
                                : DARK_BLUE_COLOR,
                          }}
                        >
                          {playerGoals}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/*<Text style={styles.text}>{JSON.stringify(item.players)}</Text>*/}
              <View style={styles.goalsHolder}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    style={[
                      { fontSize: 32, color: RED_COLOR },
                      item.winning_team_id === 1 && {
                        fontSize: 36,
                        fontWeight: "500",
                      },
                      item.winning_team_id !== 1 && { opacity: 0.5 },
                    ]}
                  >
                    {redScore}
                  </Text>
                  <Text
                    style={[styles.text, { fontSize: 22, fontWeight: "500" }]}
                  >
                    {":"}
                  </Text>
                  <Text
                    style={[
                      { fontSize: 32, color: BLUE_COLOR },
                      item.winning_team_id === 2 && { fontSize: 36 },
                      item.winning_team_id !== 2 && { opacity: 0.5 },
                    ]}
                  >
                    {blueScore}
                  </Text>
                </View>

                <Text style={styles.text}>{duration}</Text>

                <View style={styles.separator} />

                {item.goals.map((goal, index) => {
                  const shouldShowRedGoal =
                    (goal.game_player.team_id === 1 && !goal.is_own_goal) ||
                    (goal.game_player.team_id === 2 && goal.is_own_goal);
                  const shouldShowBlueGoal =
                    (goal.game_player.team_id === 2 && !goal.is_own_goal) ||
                    (goal.game_player.team_id === 1 && goal.is_own_goal);
                  return (
                    <View
                      key={goal.id}
                      style={[
                        styles.goal,
                        index % 2 === 0 && { backgroundColor: "#353535" },
                      ]}
                    >
                      <View style={{ flex: 0.4 }}>
                        {shouldShowRedGoal && (
                          <Text style={styles.ball}>{"⚽"}</Text>
                        )}
                      </View>

                      <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
                        <Text
                          style={[
                            styles.text,
                            goal.game_player.team_id === 1 && {
                              color: RED_COLOR,
                            },
                            goal.game_player.team_id === 2 && {
                              color: BLUE_COLOR,
                            },
                            goal.is_own_goal && { opacity: 0.6 },
                            styles.goalPlayerName,
                          ]}
                        >
                          {`${goal.player_id}${goal.is_own_goal ? " (OG)" : ""}`}
                        </Text>
                        {goal.time && (
                          <Text
                            style={{
                              color: "#c3c3c3",
                              fontSize: 12,
                              lineHeight: 12,
                            }}
                          >
                            {convertMiliseconds(Math.round(goal.time * 1000))}
                          </Text>
                        )}
                      </View>

                      <View style={{ flex: 0.4 }}>
                        {shouldShowBlueGoal && (
                          <Text style={[styles.ball, { textAlign: "right" }]}>
                            {"⚽"}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              <Text style={[{ fontSize: 16, textAlign: "right" }, styles.text]}>
                {`${new Date(item.created_at).toLocaleTimeString()}  `}
                <Text
                  style={[styles.text, { fontSize: 14, color: "#505050" }]}
                >{`${dateToString(item.created_at)}`}</Text>
              </Text>
            </View>
            <View style={styles.heatMapHolder}>
              {item.heatmaps?.map((item) => {
                return (
                  <HeatMap
                    key={item.id}
                    nameFilter={selectedPlayerId}
                    heatmapData={item}
                  />
                );
              })}
            </View>
          </View>
        );
      }}
    />
  );
};

export default GamesFlatList;

const styles = StyleSheet.create({
  heatMapHolder: {
    alignItems: "center",
  },
  goalPlayerName: {
    textAlign: "center",
  },
  gameIdText: {
    fontStyle: "italic",
    fontSize: 9,
    color: "#404040",
    lineHeight: 9,
    // flex: 1,
    textAlign: "right",
  },
  player: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 3,
    fontWeight: "500",
  },
  ball: { lineHeight: 14, fontSize: 14 },
  goal: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 5,
    maxWidth: 200,
    // minWidth: 150,
    backgroundColor: "#2c2c2c",
    width: "100%",
    alignItems: "center",
  },
  separator: {
    width: "40%",
    maxWidth: 150,
    borderTopColor: "#757575",
    borderTopWidth: 1,
  },
  playersHolder: {
    // backgroundColor: "#2b2b2b",
    gap: 5,
    borderRadius: 10,
  },
  goalsHolder: {
    // maxWidth: 200,
    minWidth: 150,
    gap: 5,
    flex: 1,
    alignItems: "center",
  },
  bottomHolder: {
    gap: 16,
    flexDirection: "row",
    flexWrap: "wrap-reverse",
  },
  contentContainer: {
    paddingTop: 16,
    gap: 16,
  },
  text: {
    color: "white",
  },
  renderItem: {
    gap: 10,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#333333",
    padding: 16,
    paddingTop: 5,
  },
});
