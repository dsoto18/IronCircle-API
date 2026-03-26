import { Router, Request, Response, NextFunction } from "express";
import { UserComponent } from "./user-component";
import { Dto } from "../../shared/dto";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { GetUserDTO } from "./DTOs/get-user.dto";

export class UserRouteHandler {
    public static build(): Router {
        const router = Router();

        router.post("/users", this.register);
        router.get("/users", this.getUsers);
        router.get("/users/:user", this.getUser);
        router.patch("/users/:username", this.updateUser);
        router.post("/users/:userId/followers/:followerId", this.addFollower);

        return router;
    }

    @Dto(CreateUserDTO)
    public static async register(req: Request, res: Response, next: NextFunction){
        try {
            console.log("Routehandler!")
            res.status(200).json(await UserComponent.build().createUser(
                req.body.dto as CreateUserDTO
            ))
        }
        catch (e) {
            console.log("Caught error here")
            next(e);
        }
    }
    /**
     * Search Users Route
     */
    public static getUsers(req: Request, res: Response, next: NextFunction) {
        return res.json({ message: "Get Users"});
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

    public static addFollower(req: Request, res: Response){
        return res.json({ message: "Add Follower"});
    }
}