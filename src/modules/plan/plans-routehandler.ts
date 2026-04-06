import { Router } from "express";

export class PostsRoutehandler {
    public static build(): Router {
        const router = Router();

        router.post("/:userId/plans", this.createPlan);
        router.get("/:userId/plans", this.getUsersPlans);
        router.get("/plan/:planId", this.getPlan);
        router.patch("/plan/:planId", this.updatePlan);
        router.delete("/plan/:planId", this.deletePlan);

        return router;
    }

    public static async createPlan() {
    }

    public static async getUsersPlans() {
    }

    public static async getPlan() {
    }

    public static async updatePlan() {
    }

    public static async deletePlan() {
    }
}