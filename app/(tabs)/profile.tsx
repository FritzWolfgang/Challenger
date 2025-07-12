import { supabase } from "@/lib/supabase";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profile = () => {
  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/")
  };

 return (
   <LinearGradient
     colors={["#fc5c7d", "#6a82fb"]}
     start={{ x: 0, y: 0 }}
     end={{ x: 1, y: 1 }}
     style={styles.gradient}
   >
     <View style={styles.headerContainer}>
       <Text style={styles.title}>Profil</Text>
       <Pressable
         style={styles.logoutButton}
         onPress={() => {
          signOut()
         }}
       >
         <Entypo name="log-out" size={28} color="#fff" />
       </Pressable>
     </View>
     {/* Add more profile content here */}
   </LinearGradient>
 );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Gabarito",
  },
  logoutButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    borderRadius: 50,
  },
});

export default profile;
