import { IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export enum POST_TYPE {
    RUN = "Run",
    LIFT = "Lift",
    YOGA = "Yoga",
    SWIM = "Swim",
    CYCLING = "Cycling",
    HIIT = "HIIT"
}

export class CreatePostDTO extends AbstractDto {

    @IsString()
    userId: string;

    @IsDefined()
    @IsEnum(POST_TYPE)
    type: string;

    @IsOptional()
    distance: string;

    @IsOptional()
    calories: string;

    @IsOptional()
    duration: string;

    @IsOptional()
    imageUrl: string;

    constructor(req: Request){
        super();

        this.userId= req.params.userId as string;
        this.type = req.body.type;
        this.distance = req.body.distance;
        this.calories = req.body.calories;
        this.duration = req.body.duration;
        this.imageUrl = req.body.imageUrl;
    }
}