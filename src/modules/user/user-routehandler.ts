import { Router } from "express";

export class UserRouteHandler {
    public static build(): Router {
        const router = Router();

        router.get("/users", this.getUsers);
        router.get("/users/:user", this.getUser);
        router.patch("/users/:username", this.updateUser);

        return router;
    }

    /**
     * Search Users Route
     */
    public static getUsers() {

    }

    /**
     * Returns details of a single user
     */
    public static getUser() {

    }

    /**
     * Update a User
     */
    public static updateUser() {

    }

}