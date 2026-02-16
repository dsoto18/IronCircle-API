import { Router, Request, Response } from "express";

export class UserRouteHandler {
    public static build(): Router {
        const router = Router();

        router.post("/users", this.register);
        router.get("/users", this.getUsers);
        router.get("/users/:user", this.getUser);
        router.patch("/users/:username", this.updateUser);

        return router;
    }

    public static register(req: Request, res: Response){
        return res.json({ message: "Register User"});
    }
    /**
     * Search Users Route
     */
    public static getUsers(req: Request, res: Response) {
        return res.json({ message: "Get Users"});
    }

    /**
     * Returns details of a single user
     */
    public static getUser(req: Request, res: Response) {
        return res.json({ message: "Get User"});
    }

    /**
     * Update a User
     */
    public static updateUser(req: Request, res: Response) {
        return res.json({ message: "Update Users"});
    }

}