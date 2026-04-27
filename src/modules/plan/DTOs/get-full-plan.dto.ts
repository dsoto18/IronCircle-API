import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";
import { IsString } from "class-validator";

export class GetFullPlanDTO extends AbstractDto {
    @IsString()
    planId: string;

    constructor(req: Request){
        super();
        
        this.planId = req.params.planId as string;
    }
}