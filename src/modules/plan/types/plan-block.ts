// gives flexibility for workout and meal plans
export type PlanBlock = {
    PK: string; // "PLAN#<planId>"
    SK: string; // `WEEK#${string}DAY#${string}BLOCK#${string}` e.g. "WEEK#1DAY#2BLOCK#3"
    entity: string;

    planId: string;
    weekNumber: number | string; // allowing string for now since it comes from req.body, but will convert to number in the component logic
    dayNumber: number | string; // same type of deal as weekNumber
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