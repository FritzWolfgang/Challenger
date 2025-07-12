// React & React Native
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Expo
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// Supabase
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// Components
import ChallengeView from "@/components/ChallengeView";
import { Filter } from "@/components/Filter";
import { Modal } from "@/components/Modal";
import { ChallengeType } from "@/types/ChallengeType";
import { UserType } from "@/types/UserType";
import { useChallenges } from "@/lib/useChallenges";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useUsers } from "@/lib/useUsers";

export default function Challenges() {
  const [openConfiguration, setOpenConfiguration] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [challengeTotalReps, setChallengeTotalReps] = useState("");
  const [openParticipantSearch, setOpenParticipantSearch] = useState(false);

  const { user: currentUser } = useCurrentUser();

  const [chosenParticipants, setChosenParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser?.id) {
      setChosenParticipants([currentUser.id]);
    }
  }, [currentUser?.id]);

  const { challenges, refetchChallenges } = useChallenges(currentUser?.id);
  const { users, otherUsers } = useUsers(currentUser?.id);

  const createChallenge = async () => {
    if (!challengeName || isNaN(Number(challengeTotalReps))) return;

    const { data: creator, error: authError } = await supabase.auth.getUser();
    if (authError || !creator?.user) return;

    const finalChosenUsers = users.filter((user) =>
      chosenParticipants.includes(user.name) || user.id == currentUser?.id
    );

    const participantIds = finalChosenUsers.map((user) => user.id);

    console.log(participantIds);

    const { data: challengeData, error } = await supabase
      .from("challenges")
      .insert([
        {
          name: challengeName,
          goal: Number(challengeTotalReps),
          creator: creator.user.id,
          participants: participantIds,
        },
      ])
      .select()
      .single();

    if (error || !challengeData) {
      console.error("Error creating challenge:", error);
      return;
    }

    for (const user of finalChosenUsers) {
      const { error } = await supabase.from("challenges_progress").insert([
        {
          challenge_id: challengeData.id,
          user_id: user.id,
          username: user.name,
          progress: 0,
          goal: challengeData.goal,
          name: challengeData.name,
        },
      ]);

      if (error) {
        console.error(`Error inserting progress for ${user.name}:`, error);
      }
    }

    setChallengeName("");
    setChallengeTotalReps("");
    setOpenConfiguration(false);
    await refetchChallenges();
  };

  return (
    <LinearGradient
      colors={["#fc5c7d", "#6a82fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title]}>Challenges</Text>

        <ScrollView style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <ChallengeView challenges={challenges} refetchChallenges={refetchChallenges}></ChallengeView>
        </ScrollView>

        <Modal isOpen={openConfiguration} title="Create a Challenge">
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Challenge Name"
              value={challengeName}
              onChangeText={setChallengeName}
            />
          </View>

          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Total Reps"
              value={challengeTotalReps}
              onChangeText={setChallengeTotalReps}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.container}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setOpenParticipantSearch(true);
                setOpenConfiguration(false);
              }}
            >
              <Text style={styles.buttonText}>Choose competitor(s)</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                { backgroundColor: "limegreen", marginTop: 20 },
              ]}
              onPress={() => {
                setOpenConfiguration(false);
                
                createChallenge();
              }}
            >
              <Text style={styles.buttonText}>Create</Text>
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
              onPress={() => setOpenConfiguration(false)}
            >
              <Text style={[styles.buttonText, { color: "red" }]}>Cancel</Text>
            </Pressable>
          </View>
        </Modal>

        <Filter
          objects={otherUsers
            .filter((user) => user.id)
            .map((user) => user.name)}
          
          onPressCancel={() => {
            setOpenParticipantSearch(false);
            setOpenConfiguration(true);
          }}
          onSelect={(selected) => {
            setChosenParticipants([
              ...selected,
              currentUser?.user_metadata?.full_name,
            ]);
            console.log("Selected participants:", [
              ...selected,
              currentUser?.user_metadata?.full_name,
            ]);
          }}
          isOpen={openParticipantSearch}
          style={{ marginTop: 100 }}
          title="Choose others"
        />

        <MaterialCommunityIcons
          name="sword-cross"
          size={35}
          color="black"
          style={styles.challengeButton}
          onPress={() => setOpenConfiguration(true)}
        />

        <MaterialCommunityIcons
          name="shield-sword-outline"
          size={35}
          color="black"
          style={styles.defendButton}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Gabarito",
    fontSize: 48,
    marginTop: 80,
    marginLeft: 20,
    color: "#000000",
    fontWeight: "bold",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    width: "100%",
  },
  input: {
    width: "90%",
    height: 54,
    borderColor: "#6a82fb",
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: "#f7f7fa",
    fontFamily: "Gabarito",
    fontSize: 20,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: "#6a82fb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
  challengeButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderColor: "#6a82fb",
    borderWidth: 2,
    elevation: 4,
    shadowColor: "#6a82fb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  defendButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderColor: "#fc5c7d",
    borderWidth: 2,
    elevation: 4,
    shadowColor: "#fc5c7d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
});
