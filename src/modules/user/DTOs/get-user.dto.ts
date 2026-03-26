import { IsString } from "class-validator";
import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";

export class GetUserDTO extends AbstractDto {

    @IsString()
    userIdentifier: string;

    constructor(req: Request) {
        super();
        this.userIdentifier = req.params.user as string;
    }
}