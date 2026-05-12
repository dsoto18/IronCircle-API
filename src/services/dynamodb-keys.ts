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
  post: (authorUserId: string) => `USER#${authorUserId}`, // PK for Post entity, uses UserId for Author
  explorePost:() => `EXPLORE#POSTS`, // Single PK for all explore posts since we don't need to query them by author or anything, just get all of them

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
  likedPost: (postId: string) => `LIKED_POST#${postId}`,
  explorePost: (createdAt: string, postId: string) => `POST#${createdAt}#${postId}`,

  plan: (createdAt: string, planId: string) => `PLAN#${createdAt}#${planId}`,
  week: (weekId: string) => `WEEK#${weekId}`,
  day: (weekId: string, dayId: string) => `WEEK#${weekId}DAY#${dayId}`,
  block: (weekId: string, dayId: string, blockId: string) => `WEEK#${weekId}DAY#${dayId}BLOCK#${blockId}`,
  item: (weekId: string, dayId: string, blockId: string, itemId: string) => `WEEK#${weekId}DAY#${dayId}BLOCK#${blockId}ITEM#${itemId}`,
};

export const ENTITY = {
  user: "User",
  post: "Post",
  plan: "Plan",
  username: "UsernameLock",
  email: "EmailLock",
  follow: "Follow",
  like: "Like",
  likedPost: "LikedPost",
  userPlan: "UserPlan",
  explorePost: "ExplorePost",

  // For Plan Entity, we have multiple "sub-entities" for different nodes
  week: "PlanWeek",
  day: "PlanDay",
  block: "PlanBlock",
  item: "PlanItem"
}