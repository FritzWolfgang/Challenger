import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../src/context/AuthContext"; 

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
  },
});

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
      router.push("/home");
    } catch (err) {
      console.log("Login error:", err);
      let errorMessage = "Bitte versuche es erneut.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      Alert.alert("Login fehlgeschlagen", errorMessage);
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
              secureTextEntry={true}
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Log In Button */}
          <View style={styles.container}>
            <Pressable
              style={({ pressed }) => [
                [styles.button],
                pressed && { opacity: 0.5, shadowOpacity: 0.8 },
              ]}
              onPress={/*handleLogin*/()=>router.push("/home")}
            >
              <Text style={styles.smallTextWhite}>Log in</Text>
            </Pressable>
          </View>
          
          {/* Sign In Text */}
          <View style={styles.container}>
            <Pressable
              onPress={() => {
                router.push("/registration");
              }}
            >
              <Text style={styles.smallTextBlack}>
                New?{"\n"}<Text style={{ color: "#13A2F4" }}>Sign In</Text>
              </Text>
            </Pressable>
          </View>    
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
