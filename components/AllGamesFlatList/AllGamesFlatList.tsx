import { FlatList, StyleSheet, View } from "react-native";
import { Game } from "@/components/server/GameList/GameList";
import GameItem from "@/components/ui/GameItem/GameItem";

type Props = {
  games: Game[] | null;
};

const AllGamesFlatList = ({ games }: Props) => {
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      maxToRenderPerBatch={5}
      contentContainerStyle={styles.contentContainer}
      data={games}
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
