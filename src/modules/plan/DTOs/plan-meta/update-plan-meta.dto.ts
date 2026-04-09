import { Request } from "express";
import { AbstractDto } from "../../../../shared/abstract-dto";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { GOALS, PLAN_DIFFICULTY, PLAN_TYPE } from "./create-plan.dto";

export class UpdatePlanMetaDTO extends AbstractDto{

    @IsString()
    userId: string;

    @IsString()
    planId: string;

    @IsString()
    @IsOptional()
    title: string;
    
    @IsString()
    @IsOptional()
    summary: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsEnum(GOALS)
    @IsOptional()
    goal: string;

    @IsString()
    @IsEnum(PLAN_DIFFICULTY)
    @IsOptional()
    difficulty: string;

    @IsString()
    @IsEnum(PLAN_TYPE)
    @IsOptional()
    type: string;

    @IsNumber()
    @Min(1)
    @Max(52)
    @IsOptional()
    durationWeeks: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags: string[]; // if this is provided, we override the existing tags with changes in this array

    @IsString()
    @IsOptional()
    imageUrl: string;

    constructor(req: Request){

        super();

        this.userId = req.params.userId as string;
        this.planId = req.params.planId as string;
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