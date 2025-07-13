import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const profile = () => {

  const {user, reloadUser} = useCurrentUser()

  const [usernameInput, setUsernameInput] = useState("");


  useEffect(() => {
    if (user?.username) {
      setUsernameInput(user.username);
    }
  }, [user]);


  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const updateUsername = async (username: string) => {
    // Get current user id
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "User not found or error fetching user:",
        userError?.message
      );
      return;
    }

    // Update the username in profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile username:", profileError.message);
      return;
    }

    console.log("Profile username successfully updated!");

    reloadUser()
  };





  return (
    <LinearGradient
      colors={["#fc5c7d", "#6a82fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Profile</Text>
        <Pressable
          style={styles.logoutButton}
          onPress={() => {
            signOut();
          }}
        >
          <Entypo name="log-out" size={28} color="#fff" />
          <Text style={styles.smallText}>Sign out</Text>
        </Pressable>
      </View>

      <ScrollView style={[{ margin: 10 }]}>
        <View style={styles.container}>
          <Text style={styles.normalText}>Username</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.textInput}
                value={usernameInput}
                onChangeText={setUsernameInput}
                maxLength={15}
              />
              {usernameInput === user?.username && (
                <AntDesign
                  name="check"
                  size={24}
                  color="limegreen"
                  style={{ marginLeft: -30 }}
                />
              )}
            </View>

            <Pressable
              onPress={() => {
                updateUsername(usernameInput);
              }}
            >
              <Feather name="upload-cloud" size={30} color="black" style={{borderColor: "black", padding: 10,borderWidth: 1, borderRadius: 30}} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginBottom: 8,
    width: "100%",
  },
  textInput: {
    width: 300,
    height: 50,
    borderColor: "#FDFDFD",
    borderWidth: 2,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    fontFamily: "Gabarito",
    fontSize: 20,
    paddingHorizontal: 12, 
    backgroundColor: "#fff", 
    color: "#000",
  },

  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Gabarito",
    marginLeft: 20,
  },
  logoutButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
    marginLeft: 20,
  },
  smallText: {
    color: "#fff",
    fontFamily: "Gabarito",
  },
  normalText: {
    color: "#fff",
    fontFamily: "Gabarito",
    fontSize: 25,
  },
});

export default profile;
