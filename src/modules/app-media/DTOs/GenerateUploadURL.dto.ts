import { IsEnum, IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export enum IMAGE_TYPE {
    POST = "post",
    PROFILE = "profile"
}

export enum CONTENT_TYPE {
    JPEG = "image/jpeg",
    PNG = "image/png",
    WEBP = "image/webp"
}

export class GenerateUploadUrlDTO extends AbstractDto {

    @IsString()
    @IsEnum(IMAGE_TYPE)
    imageType: string;

    @IsString()
    @IsEnum(CONTENT_TYPE)
    contentType: string

    constructor(req: Request){
        super();

        this.imageType = req.body.imageType;
        this.contentType = req.body.contentType;
    }
}