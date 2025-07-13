// hooks/useUsers.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type UserType = {
  id: string;
  name: string;
};

export function useUsers(currentUserId?: string) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [otherUsers, setOtherUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const validUsers = (data || [])
        .filter((user) => user.username)
        .map((user) => ({
          id: user.id,
          name: user.username,
        }));

      setUsers(validUsers);

      const otherValidUsers = (data || [])
        .filter((user) => user.username && user.id !== currentUserId)
        .map((user) => ({
          id: user.id,
          name: user.username,
        }));

      setOtherUsers(otherValidUsers);

      setLoading(false);
    };

    fetchUsers();
  }, [currentUserId]);

  return { users, otherUsers, loading, error };
}
