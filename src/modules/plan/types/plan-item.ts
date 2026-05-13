// Where most the real content lives, kept generic with alot of specialized fields depending on Item Type
export type PlanItem = {
  PK: string; // PLAN#<planId>
  SK: string; // `WEEK#${string}#DAY#${string}#BLOCK#${string}#ITEM#${string}`
  entity: string;

  planId: string;
  weekNumber: number | string; // see comments in other types
  dayNumber: number | string;
  blockNumber: number | string;

  itemType: string;
  title: string;
  description?: string;
  order: number; // used as itemId

  createdAt: string;
  updatedAt: string;

  // workout-specific
  sets?: string;
  reps?: string; // "8-10"
  durationMin?: string;
  distance?: string;
  restSeconds?: string;
  intensity?: string; // "RPE 8", "Zone 2", etc.
  tempo?: string;
  videoUrl?: string;

  // meal-specific
  calories?: string;
  proteinGrams?: string;
  carbsGrams?: string;
  fatGrams?: string;
  //   ingredients?: Array<{
  //     name: string;
  //     quantity?: string;
  //   }>;
  ingredients?: string[]; // for simplicity, just an array of ingredient names for now, but can be expanded to include quantities and other details if needed
  recipeUrl?: string;
};