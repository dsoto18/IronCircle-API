import { IsOptional, IsString } from "class-validator";
import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";

export class UpdateUserDTO extends AbstractDto {

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    userId: string; // temporary, should fix this but it gets set in the routehandler from middleware

    constructor(req: Request) {
        super();
        this.firstName = req.body.firstName;
        this.lastName = req.body.lastName;
        this.bio = req.body.bio;
        this.userId = "";

    }
}