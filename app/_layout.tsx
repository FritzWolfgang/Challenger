import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";
import { router, Slot, SplashScreen, usePathname } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Gabarito: require("../assets/fonts/Gabarito.ttf"),
  });

  const [session, setSession] = useState<Session | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    if (session && (pathname === "/" || pathname === "/registration")) {
      router.replace("/(tabs)/home");
    }
  }, [fontsLoaded, session, pathname]);

  if (!fontsLoaded) return null;

  return <Slot />;
}