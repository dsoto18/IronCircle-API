import { v4 as uuidv4 } from "uuid";
import { config } from "../config";

/**
 * Centralized Key Functions to create PK and SK Values
 */

export const TABLE_NAME: string = config.tableName;

export function generateUuid() {
    return uuidv4();
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
  follows: (userId: string) => `FOLLOWS#${userId}`,
  followedBy: (userId: string) => `FOLLOWED_BY#${userId}`
};

export const ENTITY = {
  user: "User",
  plan: "Plan",
  username: "UsernameLock",
  email: "EmailLock",
  follow: "Follow"
}