import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";



export default function Wetten() {
  return (
    <LinearGradient
      colors={["#6ABAFB", "#FC5CD4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title]}>Wetten</Text>

        <ScrollView
          style={{ marginTop: 20, paddingHorizontal: 20, marginBottom: 100 }}
        >
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: "#000000",
              fontSize: 25,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 10,
            }}
          >
            {"Work in progress : )"}
          </Text>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Gabarito",
    marginLeft: 20,
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
});