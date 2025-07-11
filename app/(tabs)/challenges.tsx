import { Filter } from "@/components/Filter";
import { Modal } from "@/components/Modal";
import { supabase } from "@/lib/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";


type ChallengeType = {
  name: string;
  totalReps: number;
  completedReps: number;
  participants: UserType[];
};

type UserType = {
  id: string;
  name: string;
  avatar_url?: string; // Optional avatar URL
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
      .select("id, full_name, avatar_url");

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    const validUsers = data
      .filter((u) => !!u.full_name)
      .map((u) => ({ id: u.id, name: u.full_name, avatar_url: u.avatar_url, }));

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
      .select("user_id, name, goal, progress, challenge_id");

    if (error) {
      console.error("Error fetching challenges:", error);
      return;
    }

    const challengeData = (data || [])
      .filter((entry) => entry.user_id === userID)
      .map((entry) => {
        // Finde alle Teilnehmer für diese Challenge
        const participants = (data || [])
          .filter((e) => e.challenge_id === entry.challenge_id)
          .map((e) => users.find((u) => u.id === e.user_id))
          .filter(Boolean) as UserType[];

        return {
          name: entry.name,
          totalReps: entry.goal,
          completedReps: entry.progress,
          participants,
        };
      });

    setChallenges(challengeData);
  };

  const createChallenge = async () => {
    if (!challengeName || isNaN(Number(challengeTotalReps))) return;

    const { data: creator, error: authError } = await supabase.auth.getUser();
    if (authError || !creator?.user) return;

    const participantIds = users.map((user) => user.id);

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

    for (const user of users) {
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
        <Text style={[styles.title]}>Challenges</Text>

        <ScrollView style={{ marginTop: 20, paddingHorizontal: 20 }}>
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
                        ) : (
                          null
                        )
                      )}
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <Text style={styles.challengeSubtitle}>
                      {challenge.completedReps} / {challenge.totalReps}
                    </Text>
                    <View style={[styles.progressBarBackground, { flex: 1, marginTop: 0, marginBottom: 0 }]}>
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

        {/*<Feather
          name="home"
          size={35}
          color="black"
          onPress={() => router.push("/home")}
          style={styles.homeButton}
        />*/}

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
    width: "100%"
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
});
