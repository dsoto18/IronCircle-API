import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AbstractDto } from "../../../../shared/abstract-dto";
import { Request } from "express";

export class AddItemNodeDTO extends AbstractDto {

    @IsString()
    planId: string;

    // @IsString()
    userId: string;

    @IsString()
    weekNumber: string | number;

    @IsString()
    dayNumber: string | number;
    
    @IsString()
    blockNumber: string | number;

    @IsString()
    @IsEnum(['exercise', 'meal', 'note'])
    itemType: string;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    // @IsNumber()
    // order: number; // disabling as its now determined in compnent logic

    // More Specific Content Below
    // Workout Specific
    @IsString()
    @IsOptional()
    sets: string;

    @IsString()
    @IsOptional()
    reps: string; // "8-10"

    // @IsNumber()
    @IsString()
    @IsOptional()
    durationMin: string;

    @IsString()
    @IsOptional()
    distance: string;

    @IsString()
    @IsOptional()
    restSeconds: string;

    @IsString()
    @IsOptional()
    intensity: string; // "RPE 8", "Zone 2", etc.

    @IsString()
    @IsOptional()
    tempo: string;

    @IsString()
    @IsOptional()
    videoUrl: string;

    // meal-specific


    @IsString()
    @IsOptional()
    calories?: string;

    @IsString()
    @IsOptional()
    proteinGrams: string;

    @IsString()
    @IsOptional()
    carbsGrams: string;

    @IsString()
    @IsOptional()
    fatGrams: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    // ingredients?: Array<{
    //     name: string;
    //     quantity?: string;
    // }>;
    ingredients: string[];

    @IsString()
    @IsOptional()
    recipeUrl: string;

    constructor(req: Request){
        super();
        
        this.planId = req.params.planId as string;
        this.userId = "";
        this.weekNumber = req.params.weekNumber as string;
        this.dayNumber = req.params.dayNumber as string;
        this.blockNumber = req.params.blockNumber as string;

        this.itemType = req.body.itemType;
        this.title = req.body.title;
        this.description = req.body.description;
        // this.order = req.body.order;

        this.sets = req.body.sets;
        this.reps = req.body.reps;
        this.durationMin = req.body.durationMin;
        this.distance = req.body.distance;
        this.restSeconds = req.body.restSeconds;
        this.intensity = req.body.intensity;
        this.tempo = req.body.tempo;
        this.videoUrl = req.body.videoUrl;

        this.calories = req.body.calories;
        this.proteinGrams = req.body.proteinGrams;
        this.carbsGrams = req.body.carbsGrams;
        this.fatGrams = req.body.fatGrams;
        this.ingredients = req.body.ingredients;
        this.recipeUrl = req.body.recipeUrl;
    }
}