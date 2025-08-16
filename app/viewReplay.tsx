import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import HeatMapAndReplay from "@/components/server/HeatMapAndReplay/HeatMapAndReplay";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.container}>
      <React.Suspense
        fallback={
          // The view that will render while the Server Function is awaiting data.
          <ActivityIndicator />
        }
      >
        <View style={styles.replayContainer}>
          {HeatMapAndReplay({ id: Number(id) })}
        </View>
      </React.Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  replayContainer: {
    paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: "#333333",
    minWidth: "50%",
    maxWidth: 700,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 20,
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
});
