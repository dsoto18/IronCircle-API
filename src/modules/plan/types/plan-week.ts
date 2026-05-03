// describes the week, does not hold all the days. Mostly an orgnanizational record
export type PlanWeek = {
    PK: string; // same as plan ex. "PLAN#<planId>
    SK: string; // `WEEK#${string}` ex. "WEEK#1"
    entity: string;
    
    planId: string;
    weekNumber: number;

    title: string;
    summary: string;
    notes?: string;

    createdAt: string;
    updatedAt: string;
}