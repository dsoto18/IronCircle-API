import { IsString } from "class-validator";
import { AbstractDto } from "../../../../shared/abstract-dto";
import { Request } from "express";

export class AddBlockNodeDTO extends AbstractDto {

    @IsString()
    planId: string;

    @IsString()
    userId: string;

    @IsString()
    weekNumber: string | number;

    @IsString()
    dayNumber: string | number;

    @IsString()
    title: string;

    @IsString()
    summary: string;

    @IsString()
    notes: string;

     constructor(req: Request){
        super();

        this.planId = req.params.planId as string;
        this.userId = req.body.userId as string;
        this.weekNumber = req.params.weekNumber as string;
        this.dayNumber = req.params.dayNumber as string;
        this.title = req.body.title;
        this.summary = req.body.summary;
        this.notes = req.body.notes;
     }
}