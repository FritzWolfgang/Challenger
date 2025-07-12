import { ChallengeType } from "@/types/ChallengeType";
import React, { useEffect, useState } from "react";
import { Image, TextInput } from "react-native";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Modal } from "./Modal";
import { supabase } from "@/lib/supabase";
import { useChallenges } from "@/lib/useChallenges";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { AntDesign } from "@expo/vector-icons";

type ChallengeProps = {
  challenges: ChallengeType[];
  refetchChallenges: () => void;
};

const ChallengeView: React.FC<ChallengeProps> = ({ challenges, refetchChallenges }) => {
  const [isProgressEditorOpen, setProgressEditorOpened] = useState(false);
  const [currentlyEditedChallenge, setCurrentlyEditedChallenge] =
    useState<ChallengeType>();
  const [inputValue, setInputValue] = useState("");
  const { user } = useCurrentUser();

  const deleteProgress = async (
    progressId: string | null,
    challenge_id: string
  ) => {
    if (!user) {
      console.error("No current user found");
      return;
    }

    if (!progressId) {
      console.error("Invalid progressId:", progressId);
      return;
    }

    console.log(
      "Deleting progress for:",
      progressId,
      "in challenge:",
      challenge_id
    );

    const { error: deleteError } = await supabase
      .from("challenges_progress")
      .delete()
      .eq("id", progressId);

    if (deleteError) {
      console.error("Delete failed:", deleteError.message);
      return;
    }
    const { data: challengeData, error: fetchError } = await supabase
      .from("challenges")
      .select("participants")
      .eq("id", challenge_id)
      .single();

    //console.log("Participants:",challengeData?.participants );

    if (fetchError || !challengeData) {
      console.error(
        "Error fetching challenge participants:",
        fetchError?.message
      );
      return;
    }

    const userId = user.id;

    const updatedParticipants = (challengeData.participants ?? []).filter(
      (participant: string) => participant !== userId
    );

    //console.log(updatedParticipants)

    const { data, error: updateError } = await supabase
      .from("challenges")
      .update({
        participants: updatedParticipants, // Directly set the updated array
      })
      .eq("id", challenge_id)
      .select();

    //console.log("data:", data)

    const { data: UpdatedChallengeData, error: UpdatedFetchError } =
      await supabase
        .from("challenges")
        .select("participants")
        .eq("id", challenge_id)
        .single();

    //console.log("database data:", UpdatedChallengeData?.participants)

    if (updateError) {
      console.error("Failed to update participants:", updateError.message);
      return;
    }

    //console.log("Participants updated");

    refetchChallenges();
  };

  return (
    <View>
      {challenges.map((challenge, index) => {
        const progress = Math.min(challenge.progression / challenge.goal, 1);
        return (
          <Pressable
            style={styles.challengeCard}
            key={`${challenge.name}-${index}`}
            onPress={() => {
              setCurrentlyEditedChallenge(challenge);
              setInputValue(challenge.progression.toString());
              setProgressEditorOpened(true);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.challengeTitle}>{challenge.name}</Text>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                {challenge.participants?.map((user) => {
                  const initial =
                    user.name?.charAt(0)?.toUpperCase() ?? "?";
                  return (
                    <View
                      key={user.id}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        marginLeft: -8,
                        borderWidth: 2,
                        marginBottom: 6,
                        borderColor: "#fff",
                        backgroundColor: "#eee",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#444" }}>
                        {initial}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Delete Button */}
              <Pressable
                style={[{ flexDirection: "row", marginBottom: 5 }]}
                onPress={() => {
                  //progress id null
                  deleteProgress(challenge.progressId, challenge.id);
                }}
              >
                <AntDesign name="closecircle" size={27} color="red" />
              </Pressable>
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
                {challenge.progression} / {challenge.goal}
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
          </Pressable>
        );
      })}

      <Modal isOpen={isProgressEditorOpen} title="Edit Progress">
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Enter new progress</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable
              style={[styles.adjustButton]}
              onPress={() => {
                let newVal = Number(inputValue) || 0;
                newVal = Math.max(newVal - 1, 0);
                setInputValue(newVal.toString());
              }}
            >
              <Text style={styles.adjustButtonText}>−</Text>
            </Pressable>

            <TextInput
              style={styles.textInput}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setInputValue(numericText);
              }}
              keyboardType="numeric"
              value={inputValue}
              maxLength={4}
              placeholder="0"
              placeholderTextColor="#999"
            />

            <Pressable
              style={[styles.adjustButton, { backgroundColor: "#3EEE73" }]}
              onPress={() => {
                let newVal = Number(inputValue) || 0;
                newVal = newVal + 1;
                setInputValue(newVal.toString());
              }}
            >
              <Text style={styles.adjustButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.container}>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: "limegreen", marginTop: 20 },
            ]}
            onPress={async () => {
              if (inputValue === "") {
                setInputValue("0");
              }

              const { error } = await supabase
                .from("challenges_progress")
                .update({ progress: Number(inputValue) })
                .eq("id", currentlyEditedChallenge?.progressId);

              if (error) {
                console.error("Failed to update progress:", error.message);
                return;
              }
              setProgressEditorOpened(false);
              refetchChallenges();
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: "white",
                marginTop: 20,
                borderColor: "red",
                borderWidth: 2,
              },
            ]}
            onPress={() => setProgressEditorOpened(false)}
          >
            <Text style={[styles.buttonText, { color: "red" }]}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#6a82fb",
    width: "90%",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: "#6a82fb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: "Gabarito",
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
  textInput: {
    width: 100,
    height: 56,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontFamily: "Gabarito",
    backgroundColor: "#fff",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    textAlign: "center",
  },

  inputWrapper: {
    alignItems: "center",
    marginTop: 20,
  },

  inputLabel: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
    fontFamily: "Gabarito",
  },
  adjustButton: {
    backgroundColor: "#F54D69",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6a82fb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  adjustButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 24,
    fontFamily: "Gabarito",
  },
});

export default ChallengeView;
