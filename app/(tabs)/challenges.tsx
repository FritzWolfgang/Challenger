import Challenge from "@/components/Challenge";
import { Filter } from "@/components/Filter";
import { Modal } from "@/components/Modal";
import { supabase } from "@/lib/supabase";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
}

export default function Challenges() {
  const [challenges, setChallenges] = useState<ChallengeType[]>([]);
  const [openConfiguration, setOpenConfiguration] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [challengeTotalReps, setChallengeTotalReps] = useState("");
  const [openParticipantSearch, setOpenParticipantSearch] = useState(false);

  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from("profiles").select("id, full_name");
      if (!error && data) {
        setUsers(
          data
            .filter((u: any) => !!u.full_name)
            .map((u: any) => ({ id: u.id, name: u.full_name }))
        );
      }
    }
    fetchUsers();
  }, []);

  const createChallenge = () => {
    if (!challengeName || isNaN(Number(challengeTotalReps))) return;

    setChallenges((prev) => [
      ...prev,
      {
        name: challengeName,
        totalReps: Number(challengeTotalReps),
        completedReps: 0,
      },
    
    ]);

    setChallengeName("");
    setChallengeTotalReps("");
    setOpenConfiguration(false);
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
            <Text style={[styles.title,{marginTop: 65}]}>Challenges</Text>
          </View>

        {/* Render all challenges */}
        <ScrollView style={{ marginTop: 20, paddingHorizontal: 20 }}>
          {challenges.map((challenge, index) => (
            <Challenge
              key={index}
              name={challenge.name}
              totalReps={challenge.totalReps}
              completedReps={challenge.completedReps}
            />
          ))}
        </ScrollView>

        {/* Modal */}
        <Modal isOpen={openConfiguration} title="Create a Challenge">
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Challenge Name"
              value={modalName}
              onChangeText={setModalName}
            />
          </View>

          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Total Reps"
              value={modalTotalReps}
              onChangeText={setModalTotalReps}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.container}>
            <Pressable
              style={styles.button}
              onPress={/*createChallenge*/
                () => {
                  setOpenParticipantSearch(true);
                  setOpenConfiguration(false);
                }
              }
            >
              <Text style={styles.buttonText}>Filter</Text>
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: "red", marginTop: 20 }]}
              onPress={() => {
                setOpenConfiguration(false);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: "limegreen", marginTop: 20 }]}
              onPress={() => {
                setOpenConfiguration(false);
                createChallenge()
                
              }}
            >
              <Text style={styles.buttonText}>Create</Text>
            </Pressable>
          </View>
        </Modal>

        <Filter
          objects={users.map((user) => user.name)}
          onPressCancel={() => {
            setOpenParticipantSearch(false);
            setOpenConfiguration(true);
          }}
          isOpen={openParticipantSearch}
          style={[{ marginTop: 100 }]}
          title="Choose others"
        >
          <View style={styles.container}></View>
        </Filter>

        {/* Home Button */}
        <Feather
          name="home"
          size={35}
          color="black"
          onPress={() => router.push("/home")}
          style={styles.homeButton}
        />

        {/* Add Challenge Button */}
        <MaterialCommunityIcons
          name="sword-cross"
          size={35}
          color="black"
          style={styles.challengeButton}
          onPress={() => setOpenConfiguration(true)}
        />

        {/* Defend Button */}
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
