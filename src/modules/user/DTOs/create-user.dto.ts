import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";

export class CreateUserDTO extends AbstractDto {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    username: string;

    // @IsString()
    // @IsEmail()
    email: string

    // @IsString()
    // password: string


    userId: string; // temporary, should fix this but it gets set in the routehandler from middleware

    constructor(req: Request) {
        super();
        this.firstName = req.body.firstName;
        this.lastName = req.body.lastName;
        this.username = req.body.username;
        this.email = ""; // temporary, should fix this but it gets set in the routehandler from middleware
        this.userId = "";
        // this.password = req.body.password; // REFACTOR - should be storing password in Cognito only

    }
}