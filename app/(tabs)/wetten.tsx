import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  title: {
    fontFamily: "Gabarito",
    fontSize: 50,
  },
  container: {
    paddingTop: 80,
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
  smallText: {
    fontFamily: "Gabarito",
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    lineHeight: 50,
  },
});

export default function Wetten() {
  return (
    <LinearGradient
      colors={["#6ABAFB", "#FC5CD4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Title */}
          <View style={styles.container}>
            <Text style={styles.title}>Wetten</Text>
          </View>
        </ScrollView>

        {/* Home Button */}
        <Feather
          name="home"
          size={35}
          color="black"
          onPress={() => router.push("/home")}
          style={styles.homeButton}
        />
      </View>
    </LinearGradient>
  );
}
