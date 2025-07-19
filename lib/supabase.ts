import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = "https://pvoiidwlcwdcddbwmarq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2b2lpZHdsY3dkY2RkYndtYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzc3MTAsImV4cCI6MjA2NzY1MzcxMH0.j7rfTGMym7dUyDPN4Mr1cEeZ4UhUlQ51GcMYDFfnZfk";

let supabase: ReturnType<typeof createClient>;

if (Platform.OS === "web") {
  // Use default localStorage for web
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} else {
  // Use AsyncStorage on native (iOS/Android)
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export { supabase };
