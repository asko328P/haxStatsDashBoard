"use client";

import { View, Text, StyleSheet } from "react-native";
import { PlayerInfo } from "@/components/server/PlayerInfo/PlayerInfo";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";

const StatHolder = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <Animated.View entering={FadeIn} style={styles.statHolder}>
      <Text style={styles.statText}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Animated.View>
  );
};

const Win = ({
  item,
  index,
}: {
  item: PlayerInfo["games"][0];
  index: number;
}) => {
  const matchWon = item.winning_team_id === item.game_player[0].team_id;
  const isSpec = item.game_player[0].team_id === 0;
  const winDate = new Date(item.created_at);
  const winDateDay = winDate.getDate().toString().padStart(2, "0");
  const winDateMonth = (winDate.getMonth() + 1).toString().padStart(2, "0");
  const winDateString = `${winDateDay}.${winDateMonth}`;
  return (
    <Animated.View
      entering={FadeIn.delay(index * 60)}
      style={styles.winContainer}
    >
      <View
        style={[
          styles.win,
          matchWon
            ? { backgroundColor: "#90d885" }
            : { backgroundColor: "#ba7568" },
          isSpec && { backgroundColor: "#575151" },
        ]}
      >
        <Text
          style={[
            styles.winText,
            matchWon ? { color: "#308500" } : { color: "#612828" },
            isSpec && { color: "#3a3a3a" },
          ]}
        >
          {isSpec ? "S" : matchWon ? "W" : "L"}
        </Text>
      </View>
      <Text style={styles.winDate}>
        {winDateString}
        {/*{item.created_at}*/}
      </Text>
    </Animated.View>
  );
};

type Props = {
  player: PlayerInfo;
  gameLimit: number;
};

const PlayerInfoDetails = ({ player, gameLimit }: Props) => {
  // console.log(player);
  let scoredGoals = 0;
  let scoredOwnGoals = 0;
  let winRate = 0;
  let wonGames = 0;
  let totalGames = 0;
  let scoredAssists = 0;

  //scored goals
  player.games.forEach((game) => {
    if (game.winning_team_id === game.game_player[0].team_id) {
      wonGames += 1;
    }
    if (game.game_player[0].team_id !== 0) {
      totalGames += 1;
    }

    game.goals.forEach((goal) => {
      if (goal.is_own_goal) {
        scoredOwnGoals += 1;
      } else {
        scoredGoals += 1;
      }
    });
    scoredAssists += game.assists.length;
  });
  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      {/*<Text style={styles.text}>{`Last ${gameLimit} matches:`}</Text>*/}
      <View style={styles.winsHolder}>
        {player.games.map((item, index) => {
          return (
            <Win
              key={`${item.id}${gameLimit}${player.id}`}
              item={item}
              index={index}
            />
          );
        })}
      </View>
      <View style={styles.allStatsHolder}>
        <StatHolder label={"Goals scored:"} value={scoredGoals} />
        <StatHolder label={"Assists:"} value={scoredAssists} />
        <StatHolder label={"Own goals scored:"} value={scoredOwnGoals} />
        <StatHolder
          label={"Win rate:"}
          value={`${Math.round((wonGames / totalGames) * 100)}%`}
        />
      </View>
      {/*<Text style={{ color: "#9a9a9a", flexShrink: 1 }}>*/}
      {/*  {JSON.stringify(player)}*/}
      {/*</Text>*/}
    </Animated.View>
  );
};

export default PlayerInfoDetails;

const styles = StyleSheet.create({
  statValue: {
    textAlign: "right",
    color: "#dadada",
    fontSize: 22,
  },
  statText: {
    color: "#dadada",
    fontSize: 18,
  },
  allStatsHolder: {
    gap: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statHolder: {
    flexGrow: 1,
    width: 140,
    justifyContent: "space-between",
    // borderWidth: 1,
    // borderColor: "#365f67",
    backgroundColor: "#222121",
    padding: 10,
    borderRadius: 3,
  },
  winDate: {
    color: "#858585",
    transform: [{ translateX: 5 }, { rotateZ: `${30}deg` }],
  },
  winContainer: {
    gap: 8,
  },
  text: {
    color: "#cfcfcf",
  },
  winText: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 18,
  },
  win: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    // aspectRatio: 1,
    padding: 6,
    borderRadius: 2,
  },
  winsHolder: {
    flexWrap: "wrap",
    gap: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  playerName: {
    color: "#c3b3b3",
    fontSize: 26,
    lineHeight: 28,
  },
  container: {
    gap: 6,
  },
});
