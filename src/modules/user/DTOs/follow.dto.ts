import { IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export class FollowDTO extends AbstractDto {

    @IsString()
    userId: string;

    @IsString()
    following: string;

    tokenId: string; // temporary, should fix this but it gets set in the routehandler from middleware

    constructor(req: Request){
        super();

        this.userId = req.params.userId as string;
        this.following = req.params.followerId as string;
        this.tokenId = ""; // temporary, should fix this but it gets set in the routehandler from middleware
    }
}