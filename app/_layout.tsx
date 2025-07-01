import React, { useEffect } from "react";
import { SplashScreen, Stack, Tabs } from "expo-router";
import { useFonts } from "expo-font";

export default function Layout() {
  
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Gabarito": require("../assets/fonts/Gabarito.ttf")
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
