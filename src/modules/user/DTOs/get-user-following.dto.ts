import { IsString } from "class-validator";
import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";

export class GetUserFollowingDTO extends AbstractDto {

@IsString()
userId: string;

    constructor(req: Request){
        super();

        this.userId = req.params.userId as string;
    }
}