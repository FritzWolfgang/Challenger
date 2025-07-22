import { supabase } from "@/lib/supabase";
import { router, Slot, SplashScreen, usePathname } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {useFonts} from "expo-font";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    AntDesign: require("../assets/fonts/AntDesign.ttf"),
    Entypo: require("../assets/fonts/Entypo.ttf"),
    Feather: require("../assets/fonts/Feather.ttf"),
    Ionicons: require("../assets/fonts/Ionicons.ttf"),
    MaterialCommunityIcons: require("../assets/fonts/MaterialCommunityIcons.ttf"),
    Gabarito: require("../assets/fonts/Gabarito.ttf"),
  });

  useEffect(()=>{
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, [])

  if(!fontsLoaded){
    return undefined;
  }else {
    SplashScreen.hideAsync()
  }


  const [session, setSession] = useState<Session | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

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
