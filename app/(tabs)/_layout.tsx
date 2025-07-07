import { useFonts } from "expo-font";
import { Redirect, SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext"; // <-- Add this import

export default function Layout() {
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
      <Redirect href={"./login"}/>
    ) : (
      <Stack
        screenOptions={{
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="home" options={{}} />
      </Stack>
    )
  );
}
