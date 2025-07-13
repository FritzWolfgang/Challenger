import { ChallengeType } from "@/types/ChallengeType";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useChallenges(userId?: string) {
  const [acceptedChallenges, setAcceptedChallenges] = useState<ChallengeType[]>(
    []
  );
  const [pendingChallenges, setPendingChallenges] = useState<ChallengeType[]>(
    []
  );

  const loadChallenges = async () => {
    if (!userId) return;

    // 1. Fetch all progress records for this user
    const { data: progressData, error: progressError } = await supabase
      .from("challenges_progress")
      .select("*")
      .eq("user_id", userId);

    if (progressError) {
      console.error("Error loading progress:", progressError);
      return;
    }

    // 2. Get challenge IDs from progress
    const challengeIds = progressData
      ?.map((p) => p.challenge_id)
      .filter(Boolean);

    // 3. Fetch related challenges
    const { data: challengesData, error: challengesError } = await supabase
      .from("challenges")
      .select("*")
      .in("id", challengeIds);

    if (challengesError) {
      console.error("Error loading challenges:", challengesError);
      return;
    }

    // 4. Collect unique user IDs from participants
    const participantIds = new Set<string>();
    for (const challenge of challengesData ?? []) {
      (challenge.participants ?? []).forEach((id: string) =>
        participantIds.add(id)
      );
    }

    const { data: usersData, error: usersError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", Array.from(participantIds));

    if (usersError) {
      console.error("Error loading users:", usersError);
      return;
    }

    const usersMap = new Map(
      usersData.map((u) => [u.id, { ...u, name: u.username }])
    );

    const progressMap = new Map(
      (progressData ?? []).map((p) => [p.challenge_id, p])
    );

    const formatted = (challengesData ?? []).map((challenge) => {
      const progress = progressMap.get(challenge.id);
      const fullParticipants = (challenge.participants ?? [])
        .map((id: string) => usersMap.get(id))
        .filter(Boolean);
      
      const fullInvited = (challenge.invited ?? [])
        .map((id: string) => usersMap.get(id))
        .filter(Boolean);  

      return {
        id: challenge.id,
        name: challenge.name,
        goal: challenge.goal,
        progression: progress?.progress || 0,
        participants: fullParticipants,
        invited: fullInvited,
        progressId: progress?.id || null,
        status: progress?.status || "invited",
        expires_at: challenge.expires_at || undefined,
      };
    });

    // 5. Split into accepted and pending challenges
    setAcceptedChallenges(formatted.filter((c) => c.status === "accepted"));
    setPendingChallenges(formatted.filter((c) => c.status === "invited"));
  };

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

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
          console.log("Real-time progress change:", payload);
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
          console.log("Real-time challenge change:", payload);
          loadChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(progressChannel);
      supabase.removeChannel(challengeChannel);
    };
  }, [userId]);

  return {
    acceptedChallenges,
    pendingChallenges,
    refetchChallenges: loadChallenges,
  };
}
