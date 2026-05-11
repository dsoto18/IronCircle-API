import { IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";

export class SearchUsersDTO extends AbstractDto {

    @IsString()
    text: string;


    constructor(req: Request){
        super();

        this.text = req.query.text as string;
    }
}