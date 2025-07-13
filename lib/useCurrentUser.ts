// hooks/useCurrentUser.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { UserType } from "@/types/UserType"; // adjust path if needed

export function useCurrentUser() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        setError(authError?.message || "No user found");
        setUser(null);
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", userId)
        .single();

      if (profileError || !profileData) {
        setError(profileError?.message || "Profile not found");
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: userId,
        email: authData.user.email || "",
        username: profileData.username,
        avatar_url: profileData.avatar_url || undefined,
      });
    } catch (e: any) {
      setError(e.message || "Unknown error");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, reloadUser: fetchUser };
}
