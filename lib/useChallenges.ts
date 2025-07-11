import { ChallengeType } from "@/types/ChallengeType";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useChallenges(userId?: string) {
  const [challenges, setChallenges] = useState<ChallengeType[]>([]);

  const loadChallenges = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("challenges_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      return;
    }

    const formatted = data.map((c) => ({
      id: c.id,
      name: c.name,
      totalReps: c.goal,
      completedReps: c.progress,
      participants: c.participants,
    }));
    setChallenges(formatted);
  };

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  return { challenges, refetchChallenges: loadChallenges };
}
