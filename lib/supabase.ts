import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pvoiidwlcwdcddbwmarq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2b2lpZHdsY3dkY2RkYndtYXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzc3MTAsImV4cCI6MjA2NzY1MzcxMH0.j7rfTGMym7dUyDPN4Mr1cEeZ4UhUlQ51GcMYDFfnZfk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})