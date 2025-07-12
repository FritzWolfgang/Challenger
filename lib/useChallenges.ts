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

    // Collect unique user IDs from all challenges
    const participantIds = new Set<string>();
    for (const challenge of challengesData ?? []) {
      (challenge.participants ?? []).forEach((id: string) =>
        participantIds.add(id)
      );
    }

    // Fetch users info in one batch
    const { data: usersData, error: usersError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", Array.from(participantIds));

    if (usersError) {
      console.error("Error loading users:", usersError);
      return;
    }

    const usersMap = new Map(
      usersData
        .filter((u) => u.full_name) // Remove invalid names
        .map((u) => [u.id, { ...u, name: u.full_name }])
    );

    const progressMap = new Map(
      (progressData ?? []).map((p) => [p.challenge_id, p])
    );

    const formatted = (challengesData ?? [])
      .filter((challenge) => {
        const progress = progressMap.get(challenge.id);
        return progress && challenge.participants?.includes(userId);
      })
      .map((challenge) => {
        const progress = progressMap.get(challenge.id);
        const fullParticipants = (challenge.participants ?? [])
          .map((id: string) => usersMap.get(id))
          .filter(Boolean);

        return {
          id: challenge.id,
          name: challenge.name,
          goal: challenge.goal,
          progression: progress ? progress.progress : 0,
          participants: fullParticipants,
          progressId: progress ? progress.id : null,
        };
      });

    setChallenges(formatted);
  };

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Subscribe to progress changes for the current user
    const progressChannel = supabase
      .channel(`user-progress-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "challenges_progress",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Real-time change received:", payload);
          loadChallenges();
        }
      )
      .subscribe();

    const challengeChannel = supabase
      .channel("challenges-all")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "challenges",
        },
        (payload) => {
          console.log("Challenge table change:", payload);
          loadChallenges();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(progressChannel);
      supabase.removeChannel(challengeChannel);
    };
  }, [userId]);

  return { challenges, refetchChallenges: loadChallenges };
}
