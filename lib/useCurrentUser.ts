// hooks/useCurrentUser.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setError(error.message);
      } else {
        setUser(data.user ?? null);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  return { user, loading, error };
}
