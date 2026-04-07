// Where most the real content lives, kept generic with alot of specialized fields depending on Item Type
export type PlanItem = {
  PK: string; // PLAN#<planId>
  SK: `WEEK#${string}#DAY#${string}#BLOCK#${string}#ITEM#${string}`;
  entity: 'PLAN_ITEM';

  planId: string;
  weekNumber: number;
  dayNumber: number;
  blockNumber: number;
  itemId: string;

  itemType: 'exercise' | 'meal' | 'note';
  title: string;
  description?: string;
  order: number;

  createdAt: string;
  updatedAt: string;

  // workout-specific
  sets?: number;
  reps?: string; // "8-10"
  durationMin?: number;
  distance?: string;
  restSeconds?: number;
  intensity?: string; // "RPE 8", "Zone 2", etc.
  tempo?: string;
  videoUrl?: string;

  // meal-specific
  calories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
  ingredients?: Array<{
    name: string;
    quantity?: string;
  }>;
  recipeUrl?: string;
};