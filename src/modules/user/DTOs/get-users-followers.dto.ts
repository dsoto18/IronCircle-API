import { IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export class GetUserFollowersDTO extends AbstractDto {
    @IsString()
    userId: string;

    constructor(req: Request){
        super();

        this.userId = req.params.userId as string;
    }
}