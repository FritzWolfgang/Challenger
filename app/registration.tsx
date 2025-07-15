import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (session) {
      router.replace("/(tabs)/home");
    }
  }, [session]);

  async function signUpWithEmail() {
    if (!email || !password || !username) {
      Alert.alert("Felder Unvollständig!", "Fülle alle Felder aus.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      Alert.alert("Sign Up Fehlgeschlagen", error.message);
    } else {
      Alert.alert(
        "Danke!",
        "Überprüfe dein Mail-Postfach um die E-Mail Adresse zu bestätigen."
      );
      router.replace("/");
    }
  }

  return (
    <LinearGradient
      colors={["#711C71", "#5e3be1", "#b721ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Title */}
          <View style={[styles.container, { paddingTop: 80 }]}>
            <Text style={styles.title}>Sign Up</Text>
          </View>

          {/* Username */}
          <View style={styles.container}>
            <Text style={styles.smallTextWhite}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
          <View style={styles.container}>
            <Text style={styles.smallTextWhite}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.container}>
            <Text style={styles.smallTextWhite}>Password</Text>
            <TextInput
              secureTextEntry
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Sign Up Button */}
          <View
            style={{ alignItems: "flex-start", marginTop: 50, marginLeft: 20 }}
          >
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.5, shadowOpacity: 0.8 },
              ]}
              onPress={signUpWithEmail}
            >
              <Text style={[styles.smallTextWhite, { alignSelf: "center" }]}>
                Sign Up
              </Text>
            </Pressable>

            {/* Log In Text */}
            <View style={styles.container}>
              <Pressable
                style={{ marginTop: 20, marginLeft: 50 }}
                onPress={() => router.push("/")}
              >
                <Text style={styles.smallTextWhite}>
                  {"Already have an account?  "}
                  <Text
                    style={{
                      color: "#13F413",
                      textDecorationLine: "underline",
                    }}
                  >
                    Log In
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Gabarito",
    fontSize: 50,
    color: "#fff",
    marginLeft: 20,
    marginBottom: 30,
  },
  container: {
    paddingTop: 20,
    alignItems: "flex-start",
    marginHorizontal: 20,
    width: "100%",
  },
  button: {
    marginTop: 25,
    width: "90%",
    backgroundColor: "#2fb507",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  smallTextWhite: {
    fontFamily: "Gabarito",
    fontSize: 28,
    color: "#fff",
    marginBottom: 8,
  },
  textInput: {
    width: "90%",
    height: 50,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    fontFamily: "Gabarito",
    fontSize: 20,
    backgroundColor: "white",
    paddingHorizontal: 12,
    color: "black",
  },
});
