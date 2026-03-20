import { v4 as uuidv4 } from "uuid";
import { config } from "../config";

/**
 * Centralized Key Functions to create PK and SK Values
 */

export const TABLE_NAME = config.tableName;

export function generateUuid() {
    return uuidv4();
}

export const PK = {
  user: (id: string) => `USER#${id}`,
  username: (username: string) => `USERNAME#${username}`,
  email: (email: string) => `EMAIL#${email}`,
  post: (authorUserId: string) => `USER#${authorUserId}`, // PK for Post entity, uses UserId for Author
  plan: (id: string) => `PLAN#${id}`,
};

export const SK = {
  profile: "PROFILE",
  user: "USER",
  post: (createdAt: string, postId: string) => `POST#${createdAt}#${postId}`,
  completedBy: (userId: string) => `COMPLETED#USER#${userId}`,
  follows: (userId: string) => `FOLLOWS#${userId}`,
  followedBy: (userId: string) => `FOLLOWED_BY#${userId}`,
  like: (postId: string, viewerUserId: string) => `LIKE#${postId}#USER${viewerUserId}`,
  likedPost: (postId: string) => `LIKED_POST#${postId}`
};

export const ENTITY = {
  user: "User",
  post: "Post",
  plan: "Plan",
  username: "UsernameLock",
  email: "EmailLock",
  follow: "Follow",
  like: "Like",
  likedPost: "LikedPost"
}