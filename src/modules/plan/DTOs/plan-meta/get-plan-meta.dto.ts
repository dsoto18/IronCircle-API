import { IsString } from "class-validator";
import { AbstractDto } from "../../../../shared/abstract-dto";
import { Request } from "express";

export class GetPlanMetaDTO extends AbstractDto {

    @IsString()
    planId: string;

     constructor(req: Request){
        super();
        this.planId = req.params.planId as string;
    }
}