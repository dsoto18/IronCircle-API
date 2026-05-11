import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";
import { IsString } from "class-validator";

export class GetFeedDTO extends AbstractDto {

    @IsString()
    userId: string;


    constructor(req: Request){
        super();

        this.userId = ""; // Placeholder, will be overwritten by route handler with authenticated user ID
    }
}