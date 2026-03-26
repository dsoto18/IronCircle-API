import { IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export class FollowDTO extends AbstractDto {

    @IsString()
    userId: string;

    @IsString()
    following: string;

    constructor(req: Request){
        super();

        this.userId = req.params.userId as string;
        this.following = req.params.followerId as string;
    }
}