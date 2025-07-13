import { supabase } from "@/lib/supabase"; // Make sure supabase is properly imported
import { Session } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontFamily: "Gabarito",
    fontSize: 50,
  },
  container: {
    paddingTop: 50,
    alignItems: "center",
  },
  button: {
    width: 300,
    backgroundColor: "#2fb507",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  smallTextWhite: {
    fontFamily: "Gabarito",
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    lineHeight: 50,
  },
  smallTextBlack: {
    fontFamily: "Gabarito",
    fontSize: 30,
    color: "#000",
    textAlign: "center",
    lineHeight: 50,
  },
  textInput: {
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
  }
});

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
          username: username
        },
      },
    });

    if (error) {
      Alert.alert("Sign Up Fehlgeschlagen", error.message);
    } else {
      Alert.alert("Danke!", "Überprüfe dein Mail-Postfach um die E-Mail Adresse zu bestätigen.");
      router.replace("/"); // Redirect to login
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
            <Text style={styles.smallTextBlack}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
          <View style={styles.container}>
            <Text style={styles.smallTextBlack}>Email</Text>
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
            <Text style={styles.smallTextBlack}>Password</Text>
            <TextInput
              secureTextEntry
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Sign Up Button */}
          <View style={styles.container}>
            <Pressable
              style={({ pressed }) => [
                [styles.button],
                pressed && { opacity: 0.5, shadowOpacity: 0.8 },
              ]}
              onPress={signUpWithEmail}
            >
              <Text style={styles.smallTextWhite}>Sign Up</Text>
            </Pressable>
          </View>

          {/* Log In Text */}
          <View style={styles.container}>
            <Pressable onPress={() => router.push("/")}>
              <Text style={styles.smallTextBlack}>
                Account already created?{"\n"}
                <Text style={{ color: "#13F413" }}>Log In</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
