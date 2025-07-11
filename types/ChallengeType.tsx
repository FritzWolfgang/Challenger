import { UserType } from "./UserType";

export type ChallengeType = {
  id: string;
  name: string;
  totalReps: number;
  completedReps: number;
  participants: UserType[];
};
