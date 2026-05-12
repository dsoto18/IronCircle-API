import { IsArray, IsEnum, IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export enum FEATURE_POST_CONTENT_TYPE {
    POST = 'post',
    ANNOUNCEMENT = 'announcement',
    CHALLENGE = 'challenge'
}

export class CreateFeaturePostDTO extends AbstractDto {

    @IsString()
    @IsEnum(FEATURE_POST_CONTENT_TYPE)
    contentType: string;

    @IsString()
    title: string;
    
    @IsString()
    summary: string;
    
    // unsure for now on keeping
    metadataLabel?: string;

    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    userId: string; // will be set in route handler based on authenticated user

    constructor(req: Request){
        super();
        this.contentType = req.body.contentType;
        this.title = req.body.title;
        this.summary = req.body.summary;
        this.metadataLabel = req.body.metadataLabel;
        this.tags = req.body.tags;
        this.userId = ""; // Placeholder, will be overwritten by route handler with authenticated user ID
    }
}