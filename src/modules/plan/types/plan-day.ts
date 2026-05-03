// holds the day structure
export type PlanDay = {
    PK: string; // "PLAN#<planId>"
    SK: string; // `WEEK#${string}DAY#${string}`
    entity: string;

    planId: string;
    weekNumber: number | string; // allowing string for now since it comes from req.body, but will convert to number in the component logic
    dayNumber: number;

    title?: string;
    summary?: string;
    notes?: string;

    dayLabel?: string; // e.g. "Monday", "Day 1", etc. for easy reference

    createdAt: string;
    updatedAt: string;
}