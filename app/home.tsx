import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from 'expo-router';
import { FlatList } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  title: {
    fontFamily: "Gabarito",
    fontSize: 50,
    paddingTop: 30
  },
  container: {
    paddingTop: 50,
    flex: 1,
    alignItems: "center",

  },
  button: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "purple"
  },
  smallText: {
    fontFamily: "Gabarito",
    fontSize: 20,
    color: "#fff",
    zIndex: 1,
    textAlign: "center",
    width: 200,
    height: 50,
    lineHeight: 50,
  }

})


export default function Index() {
  return (
    <ScrollView>
      {/* Title */}
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>

      </View>

      {/* WIP */}

      {/* Challenges hier*/}

      {/* Challenges Button */}
      <View style={styles.container}>
        <Pressable style={({ pressed }: { pressed: boolean }) => [
              styles.button,
              pressed && { opacity: 0.5, shadowOpacity: 0.8 }
              ]}
              onPress={() => router.push('/challenges')}
              >
              <Text style={styles.smallText}>Challenges</Text>
          </Pressable>
      </View>

      {/* Wetten Button */}
      <View style={styles.container}>
        <Pressable style={({ pressed }: { pressed: boolean }) => [
              [styles.button, {backgroundColor: "blue"}],
              pressed && { opacity: 0.5, shadowOpacity: 0.8 }
              ]}
              onPress={() => router.push('/wetten')}
              >
              <Text style={styles.smallText}>Wetten</Text>
          </Pressable>
      </View>

      {/* Registration Button (not permanent) */}
      <View style={styles.container}>
        <Pressable style={({ pressed }: { pressed: boolean }) => [
              [styles.button, {backgroundColor: "blue"}],
              pressed && { opacity: 0.5, shadowOpacity: 0.8 }
              ]}
              onPress={() => router.push('/registration')}
              >
              <Text style={styles.smallText}>Registration</Text>
          </Pressable>
      </View>        

    </ScrollView>
  );
}


