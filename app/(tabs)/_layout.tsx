import { useAuth } from "@/src/context/AuthContext";
import { useFonts } from "expo-font";
import { Redirect, SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";

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
              {/* Optionally configure static options outside the route.*/}
              <Stack.Screen name="home" options={{}} />
            </Stack>
        )
    );
}
