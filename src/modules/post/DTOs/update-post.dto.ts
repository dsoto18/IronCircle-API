import { IsDefined, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";
import { POST_TYPE, VISIBILITY } from "./create-post.dto";

export class UpdatePostDTO extends AbstractDto {

    @IsString()
    postId: string;

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

        this.postId = req.params.postId as string;
        this.userId = req.body.userId;
        this.type = req.body.type;
        this.distance = req.body.distance;
        this.calories = req.body.calories;
        this.duration = req.body.duration;
        this.imageUrl = req.body.imageUrl;
        this.caption = req.body.capation;
        this.visibility = req.body.visibility;
    }
}