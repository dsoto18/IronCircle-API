import { IsString } from "class-validator";
import { AbstractDto } from "../../../shared/abstract-dto";
import { Request } from "express";


export class CreatePostDTO extends AbstractDto {

    @IsString()
    userId: string;

    @IsString()
    title: string;

    @IsString()
    details: string;

    constructor(req: Request){
        super();

        this.userId= req.params.userId as string;
        this.title = req.body.title as string;
        this.details = req.body.details as string;
    }
}