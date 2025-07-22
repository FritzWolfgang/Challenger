import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";



export default function Wetten() {
  return (
    <LinearGradient
      colors={["#6ABAFB", "#FC5CD4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 50, gap: 20, alignItems: "center" }}>
          <Text>Font Icons:</Text>
          <AntDesign name="star" size={30} color="gold" />
          <Entypo name="emoji-happy" size={30} color="purple" />
          <Feather name="activity" size={30} color="green" />
          <Ionicons name="home-outline" size={30} color="blue" />
          <MaterialCommunityIcons name="sword-cross" size={30} color="red" />
        </View>

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