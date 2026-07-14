import { Platform, StyleSheet, View, Linking } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6, Foundation, Octicons } from "@expo/vector-icons";
import MovingGithubLink from "@/components/InfoBox/MovingLink/MovingGithubLink";
import { useEffect, useState } from "react";
import MovingDiscordLink from "@/components/InfoBox/MovingLink/MovingDiscordLink";
import { supabase } from "@/lib/supabase";
import { Game } from "@/components/server/GameList/GameList";

const InfoBox = () => {
  const [gameLink, setGameLink] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: gameLinkData, error } = await supabase
          .from("game_links")
          .select(
            `
          *
          `,
          )
          .order("id", {
            ascending: false,
          })
          .range(0, 0)
          .overrideTypes<{ game_link: string }[]>();
        setGameLink(gameLinkData?.at(0)?.game_link ?? "");
      } catch (err) {}
    };
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>
        {"Hax stats dashboard"}{" "}
        <ThemedText
          onPress={async () => {
            const supported = await Linking.canOpenURL(gameLink);

            if (supported) {
              await Linking.openURL(gameLink);
            } else {
            }
          }}
          type={"link"}
        >
          {gameLink}
        </ThemedText>
      </ThemedText>
      <View style={{ alignItems: "flex-end", gap: 5 }}>
        <MovingDiscordLink />
        <MovingGithubLink />
      </View>
    </View>
  );
};

export default InfoBox;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },

  text: {
    fontSize: 14,
    color: "#757575",
  },
  infoBox: {},
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderBottomColor: "#323232",
    backgroundColor: "#202020",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
