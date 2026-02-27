import { IsOptional } from "class-validator";
import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";

export class CreateUserDTO extends AbstractDto {

    @IsOptional()
    userID?: string;


    username?: string;

    constructor(req: Request) {
        super();
        const id = req.params.user;
    }
}