import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ChallengeType } from "@/types/ChallengeType";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { router } from "expo-router";

type PendingChallengesProps = {
  pendingChallenges: ChallengeType[];
  refetchChallenges: () => void;
};

const PendingChallengesView: React.FC<PendingChallengesProps> = ({
  pendingChallenges,
  refetchChallenges,
}) => {
  const { user, reloadUser } = useCurrentUser();

  const handleAccept = async (
    challengeID: string,
    progressId: string | null
  ) => {
    if (!user?.id) return;

    let actualProgressId = progressId;

    if (!progressId) {
      // No progress row exists — create one
      const { data: newProgress, error: insertError } = await supabase
        .from("challenges_progress")
        .insert({
          user_id: user.id,
          challenge_id: challengeID,
          status: "accepted",
          progress: 0,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating progress:", insertError.message);
        return;
      }

      actualProgressId = newProgress.id;
    } else {
      // Update existing progress status
      const { error: progressError } = await supabase
        .from("challenges_progress")
        .update({ status: "accepted" })
        .eq("id", progressId);

      if (progressError) {
        console.error("Error accepting challenge:", progressError.message);
        return;
      }
    }

    // Update participants array on challenge
    const { data: challengeData, error: fetchError } = await supabase
      .from("challenges")
      .select("participants")
      .eq("id", challengeID)
      .single();

    if (fetchError) {
      console.error("Error fetching challenge:", fetchError.message);
      return;
    }

    const currentParticipants: string[] = challengeData?.participants ?? [];
    const updatedParticipants = currentParticipants.includes(user.id)
      ? currentParticipants
      : [...currentParticipants, user.id];

    const { error: updateChallengeError } = await supabase
      .from("challenges")
      .update({ participants: updatedParticipants })
      .eq("id", challengeID);

    if (updateChallengeError) {
      console.error(
        "Error updating participants:",
        updateChallengeError.message
      );
      return;
    }

    refetchChallenges();
    router.reload();
  };

  const handleDecline = async (progressId: string) => {
    const { error } = await supabase
      .from("challenges_progress")
      .delete()
      .eq("id", progressId);

    if (error) {
      console.error("Error declining challenge:", error.message);
    } else {
      refetchChallenges();
    }
  };

  return (
    <View style={styles.container}>
      {pendingChallenges.length === 0 ? (
        <Text style={styles.emptyText}>No pending challenges</Text>
      ) : (
        pendingChallenges.map((challenge) => (
          <View key={challenge.id} style={styles.challengeCard}>
            <View style={styles.headerRow}>
              <Text style={styles.challengeName}>{challenge.name}</Text>

              <Pressable
                onPress={() => handleDecline(challenge.progressId ?? "")}
              >
                <AntDesign name="closecircle" size={24} color="red" />
              </Pressable>
            </View>

            <Text style={styles.challengeGoal}>🎯 Goal: {challenge.goal}</Text>

            <View style={styles.participantsRow}>
              {challenge.participants?.map((user, index) => {
                // Use user.id if available and unique, else fallback to index-based key
                const key = user.id ?? `${user.username ?? "user"}-${index}`;
                const initial = user.username?.charAt(0)?.toUpperCase() ?? "?";
                return (
                  <View key={key} style={styles.avatarBubble}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </View>
                );
              })}
            </View>

            <Pressable
              style={[styles.acceptButton, styles.button]}
              onPress={() => handleAccept(challenge.id, challenge.progressId)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  challengeName: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Gabarito",
  },
  challengeGoal: {
    fontSize: 16,
    color: "#444",
    fontFamily: "Gabarito",
    marginBottom: 12,
  },
  participantsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: -8,
    backgroundColor: "#ececec",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    fontWeight: "bold",
    color: "#313131",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Gabarito",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 16,
    fontFamily: "Gabarito",
  },
});

export default PendingChallengesView;
