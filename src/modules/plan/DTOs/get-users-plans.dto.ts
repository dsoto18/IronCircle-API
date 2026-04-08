import { Request } from "express";
import { IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";

export class GetUsersPlansDTO extends AbstractDto {
    
    @IsString()
    userId: string;

     constructor(req: Request){
        super();
        this.userId = req.params.userId as string;
    }
}