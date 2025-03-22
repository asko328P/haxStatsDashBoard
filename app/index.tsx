/// <reference types="react/canary" />

import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import GameList from "@/components/server/GameList/GameList";

export default function Index() {
  return (
    <View style={styles.container}>
      <React.Suspense
        fallback={
          // The view that will render while the Server Function is awaiting data.
          <ActivityIndicator />
        }
      >
        {/*{renderInfo({ name: 'World' })}*/}
        <View style={styles.gameListHolder}>{GameList()}</View>
      </React.Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  gameListHolder: { width: "50%", paddingBottom: 20, flex: 1 },
  container: {
    alignItems: "center",
    maxHeight: "100%",
  },
});
