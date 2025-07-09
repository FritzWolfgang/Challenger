import { useFonts } from "expo-font";
import { Redirect, SplashScreen, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext"; // <-- Add this import

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    "Gabarito": require("../../assets/fonts/Gabarito.ttf")
  });

  useEffect(() => {
    if (fontsLoaded){
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) return null;

  const {session} = useAuth();
  return (
  !session ? (
    <Redirect href="/" />
  ) : (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}
      }
    />
  )
  );
}
