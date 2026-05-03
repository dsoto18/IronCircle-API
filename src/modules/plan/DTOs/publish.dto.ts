import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";
import { IsString } from "class-validator";

export class PublishPlanDTO extends AbstractDto {

    @IsString()
    planId: string;

    @IsString()
    userId: string;

    @IsString()
    createdAt: string;

    constructor(req: Request){
        super();

        this.planId = req.params.planId as string;
        this.userId = req.body.userId;
        this.createdAt = req.body.createdAt;
    }
}