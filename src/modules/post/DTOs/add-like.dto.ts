import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";
import { IsString } from "class-validator";

export class AddLikeDTO extends AbstractDto {

    @IsString()
    userId: string;

    @IsString()
    postId: string;

    @IsString()
    postAuthorId: string;

    @IsString()
    postCreatedAt: string;

    constructor(req: Request){
        super();

        this.postId = req.params.postId as string;
        this.userId = req.body.userId;
        this.postAuthorId = req.body.author;
        this.postCreatedAt = req.body.createdAt;
    }
}