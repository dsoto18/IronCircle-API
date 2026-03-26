import { v4 } from "uuid";

/**
 * Centralized Key Functions to create PK and SK Values
 */

export function generateUuid() {
    return v4();
}

export const PK = {
  user: (id: string) => `USER#${id}`,
  username: (username: string) => `USERNAME#${username}`,
  email: (email: string) => `EMAIL#${email}`,
  post: (id: string) => `POST#${id}`,
  plan: (id: string) => `PLAN#${id}`,
};

export const SK = {
  profile: "PROFILE",
  user: "USER",
  completedBy: (userId: string) => `COMPLETED#USER#${userId}`,
};

export const ENTITY = {
  user: "User",
  plan: "Plan",
  username: "UsernameLock",
  email: "EmailLock"
}