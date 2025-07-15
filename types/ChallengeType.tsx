import { UserType } from "./UserType";

export type ChallengeType = {
  id: string;
  progressId: string;
  name: string;
  progression: number;
  goal: number;
  participants: UserType[];
  invited: UserType[];
  status: string;
  expires_at: string | null;
};
