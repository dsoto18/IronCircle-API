import { NextFunction, Request, Response, Router } from "express";
import { Dto } from "../../shared/dto";
import { CreatePlanDTO } from "./DTOs/create-plan.dto";
import { PlansComponent } from "./plans-component";

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

    @Dto(CreatePlanDTO)
    public static async createPlan(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().createPlan(
                req.body.dto as CreatePlanDTO
            ));
        } catch (e) {
            next(e);
        }
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