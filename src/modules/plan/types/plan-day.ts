// holds the day structure
export type PlanDay = {
    PK: string;
    SK: `WEEK#${string}DAY#${string}`;
    entity: string;

    planId: string;
    weekNumber: number;
    dayNumber: number;

    title?: string;
    summary?: string;
    notes?: string;

    dayLabel?: string; // e.g. "Monday", "Day 1", etc. for easy reference

    createdAt: string;
    updatedAt: string;
}