import { IsOptional, IsString } from "class-validator";
import { Request } from "express";
import { AbstractDto } from "../../../shared/abstract-dto";

export class UpdateUserDTO extends AbstractDto {

    @IsString()
    username: string; // required to identify the user, but not required to update. Should we make this optional and just use the userId from the token?

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    profilePictureUrl: string

    @IsString()
    @IsOptional()
    pictureKey: string

    userId: string; // temporary, should fix this but it gets set in the routehandler from middleware

    constructor(req: Request) {
        super();
        this.username = req.params.username as string; // required to identify the user, but not required to update. Should we make this optional and just use the userId from the token?
        this.firstName = req.body.firstName;
        this.lastName = req.body.lastName;
        this.bio = req.body.bio;
        this.userId = "";

        this.profilePictureUrl = req.body.profilePictureUrl;
        this.pictureKey = req.body.pictureKey;
    }
}