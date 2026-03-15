import { Router, Request, Response, NextFunction } from "express";
import { UserComponent } from "./user-component";
import { Dto } from "../../shared/dto";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { GetUserDTO } from "./DTOs/get-user.dto";
import { FollowDTO } from "./DTOs/follow.dto";
import { GetUserFollowersDTO } from "./DTOs/get-users-followers.dto";

export class UserRouteHandler {
    public static build(): Router {
        const router = Router();

        router.post("/users", this.register);
        router.get("/users", this.getUsers);
        router.get("/users/:user", this.getUser);
        router.patch("/users/:username", this.updateUser);
        router.post("/:userId/followers/:followerId", this.addFollower);
        router.get("/users/:userId/followers", this.getUsersFollowers);

        return router;
    }

    @Dto(CreateUserDTO)
    public static async register(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await UserComponent.build().createUser(
                req.body.dto as CreateUserDTO
            ))
        }
        catch (e) {
            next(e);
        }
    }
    /**
     * Search Users Route
     */
    public static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await UserComponent.build().getUsers());
        } catch (e) {
            next(e);
        } 
    }

    /**
     * Returns details of a single user
     */
    @Dto(GetUserDTO)
    public static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await UserComponent.build().getUser(
                req.body.dto as GetUserDTO
            ));
        } catch (e) {
            next(e);
        }
    }

    /**
     * Update a User
     */
    public static updateUser(req: Request, res: Response) {
        return res.json({ message: "Update Users"});
    }

    @Dto(FollowDTO)
    public static async addFollower(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await UserComponent.build().addFollower(
                req.body.dto as FollowDTO
            ));
        } catch(e) {
            next(e);
        }
    }

    @Dto(GetUserFollowersDTO)
    public static async getUsersFollowers(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await UserComponent.build().getUsersFollowers(
                req.body.dto as GetUserFollowersDTO
            ));
        } catch(e) {
            next(e);
        }
    }
}