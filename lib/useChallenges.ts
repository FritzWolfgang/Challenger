import { ChallengeType } from "@/types/ChallengeType";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useChallenges(userId?: string) {
  const [challenges, setChallenges] = useState<ChallengeType[]>([]);

  const loadChallenges = async () => {
    if (!userId) return;

    const { data: progressData, error: progressError } = await supabase
      .from("challenges_progress")
      .select("*")
      .eq("user_id", userId);

    if (progressError) {
      console.error("Error loading progress:", progressError);
      return;
    }

    const { data: challengesData, error: challengesError } = await supabase
      .from("challenges")
      .select("*");

    if (challengesError) {
      console.error("Error loading challenges:", challengesError);
      return;
    }

    const progressMap = new Map(
      (progressData ?? []).map((p) => [p.challenge_id, p])
    );

    const formatted = (challengesData ?? []).map((challenge) => {
      const progress = progressMap.get(challenge.id);
      return {
        id: challenge.id,
        name: challenge.name,
        goal: challenge.goal, 
        progression: progress ? progress.progress : 0, 
        participants: challenge.participants ?? [],
        progressId: progress ? progress.id : null,
      };
    });


    setChallenges(formatted);
  };

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  return { challenges, refetchChallenges: loadChallenges };
}
