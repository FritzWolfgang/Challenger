import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ChallengeProps = {
  onPress?: () => void;
  name?: string;
  challenger?: string;
  participants?: string[];
  totalReps?: number;
  completedReps?: number;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
  },
  progressBarSection: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF3B",
  },
  progressBarBackground: {
    width: 300,
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#5e3be1",
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    marginTop: 4,
    color: "#333",
    fontWeight: "bold",
    fontFamily: "Gabarito"
  },
});

const Challenge: React.FC<ChallengeProps> = ({ onPress, name = "", challenger, participants, totalReps = 0, completedReps = 0 }) => {
  const progress = Math.min(completedReps / totalReps, 1);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarSection}>
        <Text style={{ fontFamily: "Gabarito", fontSize: 30, color: "black" }}>{/* challenger profile picture */}{name}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedReps} / {totalReps} Wiederholungen
        </Text>
      </View>
    </View>
  );
};

export default Challenge;
