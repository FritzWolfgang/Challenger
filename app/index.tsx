import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import "expo-font";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login fehlgeschlagen!", error.message);
      } else {
        console.log("Login erfolgreich!");
        router.replace("/(tabs)/challenges"); // <- redirect after login (see next section)
      }
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert("Unerwarteter Fehler!", err.message);
      } else {
        Alert.alert("Unerwarteter Fehler!", "Unknown error");
      }
    }
  };

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
            <Text style={styles.title}>Login</Text>
          </View>

          {/* Email */}
          <View style={styles.container}>
            <Text style={styles.smallTextWhite}>Email</Text>
            <TextInput
              style={[styles.textInput, { color: "black" }]}  
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
              secureTextEntry={true}
              style={[styles.textInput, { color: "black" }]}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Log In Button */}
          <View
            style={styles.loginContainer}
          >
            
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.5, shadowOpacity: 0.8 },
              ]}
              onPress={handleLogin}
            >
              <Text style={[styles.smallTextWhite, { alignSelf: "center" }]}>
                Log in
              </Text>
            </Pressable>

            {/* Sign In Text */}
            <View style={[{marginTop: 20}]}>
              <Pressable
                onPress={() => {
                  router.push("/registration");
                }}
              >
                <Text style={styles.smallTextWhite}>
                  {"No account yet?  "}
                  <Text
                    style={{
                      color: "#13A2F4",
                      alignSelf: "center",
                      textDecorationLine: "underline",
                    }}
                  >
                    Sign Up
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
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Gabarito",
    marginLeft: 10,
    marginBottom: 30,
  },
  container: {
    paddingTop: 20,
    alignItems: "flex-start",
    marginHorizontal: 20, 
    width: "100%", 
  },
  loginContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    marginTop: 25,
    width: "50%",
    backgroundColor: "#2fb507",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  smallTextWhite: {
    fontFamily: "Gabarito",
    fontSize: 28, // Slightly smaller to match profile labels
    color: "#fff",
    marginBottom: 8, // Space between label and input
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
    paddingHorizontal: 12, // Add horizontal padding inside input
  },
});

