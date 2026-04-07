// gives flexibility for workout and meal plans
export type PlanBlock = {
    PK: string;
    SK: `WEEK#${string}DAY#${string}BLOCK#${string}`; // e.g. "WEEK#1DAY#2BLOCK#3"
    entity: string;

    planId: string;
    weekNumber: number;
    dayNumber: number;
    blockNumber: number;

    title: string;
    notes?: string;

    blockType?:
        | "warmup"
        | "strength"
        | "cardio"
        | "mobility"
        | "cooldown"
        | "meal"
        | "preworkout"
        | "postworkout"
        | "hydration"
        | "supplement"
        | "rest"
        | "activeRecovery"
        | "cheatMeal"
        | "treat"
        | "breakfast"
        | "lunch"
        | "dinner"
        | "snack"
        | "custom";

    createdAt: string;
    updatedAt: string;
}