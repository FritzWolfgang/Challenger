import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";

export default function Layout() {
  
  const [fontsLoaded] = useFonts({
    "Gabarito": require("../../assets/fonts/Gabarito.ttf")
  })

  useEffect(() => {
    if (fontsLoaded){
      console.log("Fonts Loaded");
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) return null;

  return (


    
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="home" options={{}} />
    </Stack>
  );
}
