import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";
import { IsString } from "class-validator";

export class GetLikesDTO extends AbstractDto {

    @IsString()
    postId: string;

    constructor(req: Request){
        super();
        this.postId = req.params.postId as string;
    }
}