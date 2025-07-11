// hooks/useUsers.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type UserType = {
  id: string;
  name: string;
};

export function useUsers(currentUserId?: string) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const validUsers = (data || [])
        .filter((user) => user.full_name && user.id !== currentUserId)
        .map((user) => ({
          id: user.id,
          name: user.full_name,
        }));

      setUsers(validUsers);
      setLoading(false);
    };

    fetchUsers();
  }, [currentUserId]);

  return { users, loading, error };
}
