// describes the week, does not hold all the days. Mostly an orgnanizational record
export type PlanWeek = {
    PK: string;
    SK: `WEEK#${string}`;
    entity: string;
    
    planId: string;
    weekNumber: number;

    title: string;
    summary: string;
    notes?: string;

    createdAt: string;
    updatedAt: string;
}