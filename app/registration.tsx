import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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
  }
});

export default function Registration() {
  return (
    <LinearGradient
      colors={["#711C71", "#5e3be1", "#b721ff"]} // blue and purple gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Title */}
          <View style={[styles.container,{paddingTop: 80}]}>
            <Text style={styles.title}>Sign in</Text>
          </View>

          {/* Username */}
          <View style={styles.container}>
            <Text style={styles.smallTextBlack}>Username</Text>
            <TextInput style={styles.textInput} />
          </View>

          {/* Email */}
          <View style={styles.container}>
            <Text style={styles.smallTextBlack}>Email</Text>
            <TextInput style={styles.textInput} />
          </View>

          {/* Password */}
          <View style={styles.container}>
            <Text style={styles.smallTextBlack}>Password</Text>
            <TextInput secureTextEntry={true} style={styles.textInput} />
          </View>

          {/* Log In Button */}
          <View style={styles.container}>
            <Pressable
              style={({ pressed }) => [
                [styles.button],
                pressed && { opacity: 0.5, shadowOpacity: 0.8 },
              ]}
              onPress={() => {
                //log in logic
                router.push("/home")
              }}
            >
              <Text style={styles.smallTextWhite}>Sign In Now</Text>
            </Pressable>
          </View>
          
          {/* Sign In Text */}
          <View style={styles.container}>
            <Pressable
              onPress={() => {
                // CHANGE THIS TO SIGN IN PAGE
                router.push("/");
              }}
            >
              <Text style={styles.smallTextBlack}>
                Account already created?{"\n"}<Text style={{ color: "#13F413" }}>Log In</Text>
              </Text>
            </Pressable>
          </View>    

        </ScrollView>
      </View>
    </LinearGradient>
  );
}
