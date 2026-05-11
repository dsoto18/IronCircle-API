import { IsOptional, IsString } from "class-validator";
import { AbstractDto } from "../../../../shared/abstract-dto";
import { Request } from "express";

export class AddWeekNodeDTO extends AbstractDto {

    @IsString()
    planId: string;

    // @IsString()
    userId: string;

    @IsString()
    title: string;

    @IsString()
    summary: string;

    @IsString()
    @IsOptional()
    notes: string;

    constructor(req: Request){
        super();

        this.planId = req.params.planId as string;
        this.userId = ""; // Placeholder, will be overwritten by route handler with authenticated user ID
        this.title = req.body.title;
        this.summary = req.body.summary;
        this.notes = req.body.notes;
    }
}