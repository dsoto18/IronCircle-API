import { Router, Request, Response, NextFunction } from "express";
import { UserComponent } from "./user-component";
import { Dto } from "../../shared/dto";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { GetUserDTO } from "./DTOs/get-user.dto";
import { FollowDTO } from "./DTOs/follow.dto";
import { GetUserFollowersDTO } from "./DTOs/get-users-followers.dto";
import { GetUserFollowingDTO } from "./DTOs/get-user-following.dto";
import { authMiddleware, AuthRequest } from "../../middleware/authMiddleware";

export class UserRouteHandler {
    public static build(): Router {
        const router = Router();

        // auth route
        router.get("/users/me", authMiddleware, this.getMe);

        router.post("/users", authMiddleware, this.register); // onboarding route, rename functions
        router.get("/users", this.getUsers); // TODO
        router.get("/users/:user", this.getUser); // Public GET User route
        router.patch("/users/:username", this.updateUser);
        router.post("/:userId/followers/:followerId", this.addFollower);
        router.get("/users/:userId/followers", this.getUsersFollowers);
        router.get("/users/:userId/following", this.getUsersFollowing);

        return router;
    }

    public static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.sub;
            const result = await UserComponent.build().getMe(userId);

            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    @Dto(CreateUserDTO)
    public static async register(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const email = req.user!.email;
            const userId = req.user!.sub;
            // console.log("Email from auth middleware:", email);
            res.status(200).json(await UserComponent.build().createUser(
                {...req.body.dto, email, userId } as CreateUserDTO
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

    @Dto(GetUserFollowingDTO)
    public static async getUsersFollowing(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await UserComponent.build().getAccountsUserFollows(
                req.body.dto.userId
            ));
        } catch(e) {
            next(e);
        }
    }
}