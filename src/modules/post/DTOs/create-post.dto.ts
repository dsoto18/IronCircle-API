import { IsDefined, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
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

export enum VISIBILITY {
    PRIVATE = "private",
    FOLLOWERS = "followers", // default
    PUBLIC = "everyone"
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

    @IsOptional()
    @MaxLength(256)
    caption: string;

    @IsDefined()
    @IsEnum(VISIBILITY)
    visibility: string;


    constructor(req: Request){
        super();

        this.userId= req.params.userId as string;
        this.type = req.body.type;
        this.distance = req.body.distance;
        this.calories = req.body.calories;
        this.duration = req.body.duration;
        this.imageUrl = req.body.imageUrl;
        this.caption = req.body.caption;
        this.visibility = req.body.visibility;
    }
}