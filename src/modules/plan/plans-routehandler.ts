import { NextFunction, Request, Response, Router } from "express";
import { Dto } from "../../shared/dto";
import { CreatePlanDTO } from "./DTOs/create-plan.dto";
import { GetUsersPlansDTO } from "./DTOs/get-users-plans.dto";
import { PlansComponent } from "./plans-component";
import { GetPlanMetaDTO } from "./DTOs/get-plan-meta.dto";

export class PostsRoutehandler {
    public static build(): Router {
        const router = Router();

        // -------------- Meta Plan Routes --------------------
        router.post("/:userId/plans", this.createPlanMeta);
        router.get("/:userId/plans", this.getUsersPlans);
        router.get("/plan/:planId", this.getPlanMeta);
        router.patch("/plan/:planId", this.updatePlanMeta);
        router.delete("/plan/:planId", this.deletePlan);
        // ----------------------------------------------------

        // POST Nodes
        router.post("/plans/:planId/weeks", this.addWeekToPlan);
        router.post("/plans/:planId/weeks/:weekNumber/days", this.addDayToWeek);
        router.post("/plans/:planId/weeks/:weekNumber/days/:dayNumber/blocks", this.addBlockToDay);
        router.post("/plans/:planId/weeks/:weekNumber/days/:dayNumber/blocks/:blockNumber/items", this.addItemToBlock);

        // PATCH Nodes
        router.patch("/plans/:planId/weeks/:weekNumber", this.updateWeek);
        router.patch("/plans/:planId/weeks/:weekNumber/days/:dayNumber", this.updateDay);
        router.patch("/plans/:planId/weeks/:weekNumber/days/:dayNumber/blocks/:blockNumber", this.updateBlock);
        router.patch("/plans/:planId/weeks/:weekNumber/days/:dayNumber/blocks/:blockNumber/items/:itemId", this.updateItem);

        // Get Full Plan
        router.get("/plan/:planId/full", this.getFullPlan);
        return router;
    }

    @Dto(CreatePlanDTO)
    public static async createPlanMeta(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().createPlanShell(
                req.body.dto as CreatePlanDTO
            ));
        } catch (e) {
            next(e);
        }
    }

    @Dto(GetUsersPlansDTO)
    public static async getUsersPlans(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().getUsersPlans(
                req.body.dto as GetUsersPlansDTO
            ));
        } catch(e) {
            next(e);
        }
    }

    @Dto(GetPlanMetaDTO)
    public static async getPlanMeta(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().getPlanMeta(
                req.body.dto as GetPlanMetaDTO
            ));
        } catch(e) {
            next(e);
        }
    }

    public static async updatePlanMeta() {
    }

    public static async deletePlan() {
    }

    public static async addWeekToPlan() {
    }

    public static async addDayToWeek() {
    }

    public static async addBlockToDay() {
    }

    public static async addItemToBlock() {
    }

    public static async updateWeek() {
    }

    public static async updateDay() {
    }

    public static async updateBlock() {
    }

    public static async updateItem() {
    }

    public static async getFullPlan() {
    }
}