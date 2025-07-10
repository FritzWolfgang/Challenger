import Challenge from "@/components/Challenge";
import { Filter } from "@/components/Filter";
import { Modal } from "@/components/Modal";
import { supabase } from "@/lib/supabase";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const styles = StyleSheet.create({
  title: {
    fontFamily: "Gabarito",
    fontSize: 50,
  },
  container: {
    marginVertical: 15,
    alignItems: "center",
  },
  homeButton: {
    position: "absolute",
    top: 83,
    left: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 80,
    borderColor: "black",
    borderWidth: 2,
  },
  challengeButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  defendButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  input: {
    width: 300,
    height: 50,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    fontFamily: "Gabarito",
    fontSize: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#127DF8",
    width: 300,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

type ChallengeType = {
  name: string;
  totalReps: number;
  completedReps: number;
};

type UserType = {
  id: string;
  name: string;
};

export default function Challenges() {
  const [challenges, setChallenges] = useState<ChallengeType[]>([]);
  const [openConfiguration, setOpenConfiguration] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [challengeTotalReps, setChallengeTotalReps] = useState("");
  const [openParticipantSearch, setOpenParticipantSearch] = useState(false);
  const [chosenObjects, setChosenObjects] = useState<string[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
    loadChallenges();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChallenges();
    }, [])
  );

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name");

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    const validUsers = data
      .filter((u) => !!u.full_name)
      .map((u) => ({ id: u.id, name: u.full_name }));

    setUsers(validUsers);
  };

  const fetchCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      setCurrentUser(data.user);
    } else {
      console.error("Error getting current user:", error);
    }
  };

  const loadChallenges = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Error fetching user:", userError);
      return;
    }

    const userID = userData.user.id;

    const { data, error } = await supabase
      .from("challenges_progress")
      .select("user_id, name, goal, progress");

    if (error) {
      console.error("Error fetching challenges:", error);
      return;
    }

    const challengeData = (data || [])
      .filter((entry) => entry.user_id === userID)
      .map((entry) => ({
        name: entry.name,
        totalReps: entry.goal,
        completedReps: entry.progress,
      }));

    setChallenges(challengeData);
  };

  const createChallenge = async () => {
    if (!challengeName || isNaN(Number(challengeTotalReps))) return;

    const { data: creator, error: authError } = await supabase.auth.getUser();
    if (authError || !creator?.user) return;

    const { data: challengeData, error } = await supabase
      .from("challenges")
      .insert([
        {
          name: challengeName,
          goal: Number(challengeTotalReps),
          creator: creator.user.id,
        },
      ])
      .select()
      .single();

    if (error || !challengeData) {
      console.error("Error creating challenge:", error);
      return;
    }

    const selectedUsers = users.filter((user) =>
      chosenObjects.includes(user.name)
    );

    for (const user of selectedUsers) {
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
    loadChallenges();
  };

  return (
    <LinearGradient
      colors={["#fc5c7d", "#6a82fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={[styles.title, { marginTop: 65 }]}>Challenges</Text>
        </View>

        <ScrollView style={{ marginTop: 20, paddingHorizontal: 20 }}>
          {challenges.map((challenge, index) => (
            <Challenge
              key={`${challenge.name}-${index}`}
              name={challenge.name}
              totalReps={challenge.totalReps}
              completedReps={challenge.completedReps}
            />
          ))}
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
              <Text style={styles.buttonText}>Filter</Text>
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: "red", marginTop: 20 }]}
              onPress={() => setOpenConfiguration(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
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
          </View>
        </Modal>

        <Filter
          objects={users
            .filter((user) => user.id !== currentUser?.id)
            .map((user) => user.name)}
          onPressCancel={() => {
            setOpenParticipantSearch(false);
            setOpenConfiguration(true);
          }}
          onSelect={(selected) => {
            setChosenObjects([selected, currentUser?.user_metadata?.full_name]);
            console.log("Selected participants:", selected);
          }}
          isOpen={openParticipantSearch}
          style={{ marginTop: 100 }}
          title="Choose others"
        />

        <Feather
          name="home"
          size={35}
          color="black"
          onPress={() => router.push("/home")}
          style={styles.homeButton}
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
