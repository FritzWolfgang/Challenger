import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontFamily: "Gabarito",
    fontSize: 50,
  },
  container: {
    paddingTop: 80,
    alignItems: "center",
  },
  button: {
    position: 'absolute',  
    bottom: 20,
    left: 20,
    width: 200,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  smallText: {
    fontFamily: "Gabarito",
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    lineHeight: 50,
  }
});

export default function Challenges() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Title */}
        <View style={styles.container}>
          <Text style={styles.title}>Challenges</Text>
        </View>

        

      </ScrollView>

      {/* Fixed Home Button */}
      <Pressable
        style={({ pressed }) => [
          [styles.button, {backgroundColor: "red"}],
          pressed && { opacity: 0.5, shadowOpacity: 0.8 }
        ]}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.smallText}>Home</Text>
      </Pressable>
    </View>
  );
}