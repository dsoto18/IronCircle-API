import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AbstractDto } from "../../../../shared/abstract-dto";
import { GOALS, PLAN_DIFFICULTY, PLAN_TYPE } from "./create-plan.dto";
import { Request } from "express";

export class GetBrowsablePlansDTO extends AbstractDto {

    @IsNumber()
    @IsOptional()
    limit: number;

    @IsString()
    @IsOptional()
    cursor: string

    @IsString()
    @IsEnum(PLAN_TYPE)
    @IsOptional()
    type: string;

    @IsString()
    @IsEnum(GOALS)
    @IsOptional()
    goal: string;

    @IsString()
    @IsEnum(PLAN_DIFFICULTY)
    @IsOptional()
    difficulty: string;

    constructor(req: Request){
        super();

        this.limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        this.cursor = req.query.cursor as string;
        this.type = req.query.type as string;
        this.goal = req.query.goal as string;
        this.difficulty = req.query.difficulty as string;
    }   
}