import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";
import { IsString } from "class-validator";

export class GetFeedDTO extends AbstractDto {

    @IsString()
    userId: string;


    constructor(req: Request){
        super();

        this.userId = req.params.userId as string;
    }
}