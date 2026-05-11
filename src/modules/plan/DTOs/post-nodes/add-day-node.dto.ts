import { Request } from "express";
import { AbstractDto } from "../../../../shared/abstract-dto";
import { IsOptional, IsString } from "class-validator";

export class AddDayNodeDTO extends AbstractDto {

    @IsString()
    planId: string;

    // @IsString()
    userId: string;

    @IsString()
    weekNumber: string | number;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    summary: string;

    @IsString()
    @IsOptional()
    notes: string;

    @IsString()
    @IsOptional()
    dayLabel: string;

    constructor(req: Request){
        super();

        this.planId = req.params.planId as string;
        this.userId = ""; // Placeholder, will be overwritten by route handler with authenticated user ID
        this.weekNumber = req.params.weekNumber as string;
        this.title = req.body.title;
        this.summary = req.body.summary;
        this.notes = req.body.notes;
        this.dayLabel = req.body.dayLabel;
    }
}