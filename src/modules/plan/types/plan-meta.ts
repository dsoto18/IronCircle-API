export type PlanMeta = {
    PK: string;
    SK: "META";
    entity: string;

    planId: string;
    userId: string; // creator userId

    title: string;
    summary: string;
    description?: string;

    goal: string;
    difficulty: string;
    type: string;

    durationWeeks: number;
    tags?: string[];
    imageUrl?: string;

    status: "draft" | "published" | "archived";

    createdAt: string;
    updatedAt: string;

    enrollmentCount: number;
}