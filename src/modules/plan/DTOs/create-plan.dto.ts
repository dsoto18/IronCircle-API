import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export enum GOALS {
    MARATHON = 'marathon-training',
    MUSCLE = 'muscle-building',
    STRENGTH = 'strength-training',
    WEIGHT_LOSS = 'weight-loss',
    FLEXIBILITY = 'flexibility-mindfulness',
    HIIT = 'hiit',
    GENERAL = 'general-fitness'
}

export enum PLAN_DIFFICULTY {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export enum PLAN_TYPE {
    MEAL = 'meal',
    WORKOUT = 'workout',
    HYBRID = 'hybrid'
}

export class CreatePlanDTO extends AbstractDto {
    
    @IsString()
    userId: string;

    @IsString()
    title: string;
    
    @IsString()
    summary: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsEnum(GOALS)
    goal: string;

    @IsString()
    @IsEnum(PLAN_DIFFICULTY)
    difficulty: string;

    @IsNumber()
    @Min(1)
    @Max(52)
    durationWeeks: number; // one week to a year

    @IsString()
    @IsEnum(PLAN_TYPE)
    type: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags: string[];

    @IsString()
    @IsOptional()
    imageUrl: string;

    constructor(req: Request){
        super();

        this.userId = req.params.userId as string;
        this.title = req.body.title;
        this.summary = req.body.summary;
        this.description = req.body.description;
        this.goal = req.body.goal;
        this.difficulty = req.body.difficulty;
        this.durationWeeks = req.body.durationWeeks;
        this.type = req.body.type;
        this.tags = req.body.tags;
        this.imageUrl = req.body.imageUrl;
    }
}