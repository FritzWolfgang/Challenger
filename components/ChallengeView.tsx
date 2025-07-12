import { ChallengeType } from "@/types/ChallengeType";
import React, { useEffect, useState } from "react";
import { Image, TextInput } from "react-native";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Modal } from "./Modal";
import { supabase } from "@/lib/supabase";
import { useChallenges } from "@/lib/useChallenges";
import { useCurrentUser } from "@/lib/useCurrentUser";

type ChallengeProps = {
  challenges: ChallengeType[];
};

const ChallengeView: React.FC<ChallengeProps> = ({
  challenges,
}) => {
  const [isProgressEditorOpen, setProgressEditorOpened] = useState(false);
  const [currentlyEditedChallenge, setCurrentlyEditedChallenge] = useState<ChallengeType>()
  const [inputValue, setInputValue] = useState("")
  const { user } =  useCurrentUser()
  const { refetchChallenges } = useChallenges(user?.id);


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
        {/* Progress editing*/}
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              setInputValue(numericText);
            }}
            keyboardType="numeric"
            value={inputValue}
            maxLength={4}
          />
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
                .update({ progress: Number(inputValue) }) // make sure it's a number
                .eq("id", currentlyEditedChallenge?.progressId);

              if (error) {
                console.error("Failed to update progress:", error.message);
                return;
              }else{
                refetchChallenges()
              }

              setProgressEditorOpened(false);
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
    width: 75,
    height: 60,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    fontFamily: "Gabarito",
    fontSize: 25,
  },
});

export default ChallengeView;
