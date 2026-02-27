import { v4 } from "uuid";

/**
 * Centralized Key Functions to create PK and SK Values
 */

export function generateUuid() {
    return v4();
}

export const PK = {
  user: (id: string) => `USER#${id}`,
  post: (id: string) => `POST#${id}`,
  plan: (id: string) => `PLAN#${id}`,
};

export const SK = {
  profile: "PROFILE",
  completedBy: (userId: string) => `COMPLETED#USER#${userId}`,
};