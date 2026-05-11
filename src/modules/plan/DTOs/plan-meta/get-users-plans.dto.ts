import { Request } from "express";
import { IsString } from "class-validator";
import { AbstractDto } from "../../../../shared/abstract-dto";

export class GetUsersPlansDTO extends AbstractDto {
    
    @IsString()
    userId: string;

    tokenUser?: string; // The user ID from the token, used for authorization checks in the route handler

     constructor(req: Request){
        super();
        this.userId = req.params.userId as string;
        this.tokenUser = ""; // Placeholder, will be overwritten by route handler with authenticated user ID
    }
}