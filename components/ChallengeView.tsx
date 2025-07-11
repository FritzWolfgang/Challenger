import { ChallengeType } from "@/types/ChallengeType";
import React from "react";
import { Image } from "react-native";
import { StyleSheet, Text, View, Pressable } from "react-native";


type ChallengeProps = {
  onAdd?: () => void;
  onRemove?: () => void;
  challenges: ChallengeType[]
};

const ChallengeView: React.FC<ChallengeProps> = ({
  challenges,
  onAdd,
  onRemove,
}) => {
  return (
    <View>
      {challenges.map((challenge, index) => {
        const progress = Math.min(
          challenge.completedReps / challenge.totalReps,
          1
        );
        return (
          <View style={styles.challengeCard} key={`${challenge.name}-${index}`}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.challengeTitle}>{challenge.name}</Text>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                {challenge.participants?.map((user) =>
                  user.avatar_url ? (
                    <Image
                      key={user.id}
                      source={{ uri: user.avatar_url }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        marginLeft: -8,
                        borderWidth: 2,
                        marginBottom: 6,
                        borderColor: "#fff",
                        backgroundColor: "#eee",
                      }}
                    />
                  ) : null
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <Text style={styles.challengeSubtitle}>
                {challenge.completedReps} / {challenge.totalReps}
              </Text>
              <View
                style={[
                  styles.progressBarBackground,
                  { flex: 1, marginTop: 0, marginBottom: 0 },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
  },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#ececec",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#78F79E",
    borderRadius: 8,
  },
  challengeCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0,
    width: "100%",
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    fontFamily: "Gabarito",
    marginRight: 10,
  },
  challengeSubtitle: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Gabarito",
  },
});

export default ChallengeView;
