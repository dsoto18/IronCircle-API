import { NextFunction, Request, Response, Router } from "express";
import { Dto } from "../../shared/dto";
import { CreatePlanDTO } from "./DTOs/plan-meta/create-plan.dto";
import { GetUsersPlansDTO } from "./DTOs/plan-meta/get-users-plans.dto";
import { PlansComponent } from "./plans-component";
import { GetPlanMetaDTO } from "./DTOs/plan-meta/get-plan-meta.dto";
import { UpdatePlanMetaDTO } from "./DTOs/plan-meta/update-plan-meta.dto";
import { AddWeekNodeDTO } from "./DTOs/post-nodes/add-week-node.dto";
import { AddDayNodeDTO } from "./DTOs/post-nodes/add-day-node.dto";
import { AddBlockNodeDTO } from "./DTOs/post-nodes/add-block-node.dto";
import { AddItemNodeDTO } from "./DTOs/post-nodes/add-item-node.dto";
import { UpdateWeekNodeDTO } from "./DTOs/patch-nodes/update-week-node.dto";
import { GetBrowsablePlansDTO } from "./DTOs/plan-meta/browse-plans.dto";
import { PublishPlanDTO } from "./DTOs/publish.dto";

export class PlansRoutehandler {
    public static build(): Router {
        const router = Router();

        // Browse Route
        router.get("/plans", this.browsePlans);

        // -------------- Meta Plan Routes --------------------
        router.post("/:userId/plans", this.createPlanMeta);
        router.get("/:userId/plans", this.getUsersPlans);
        router.get("/plan/:planId", this.getPlanMeta);
        router.patch("/:userId/plan/:planId", this.updatePlanMeta);
        router.delete("/plan/:planId", this.deletePlan); // TODO: Implement Later
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

        // Publish Plan
        router.post("/plan/:planId/publish", this.publishPlan);
        return router;
    }

    @Dto(GetBrowsablePlansDTO)
    public static async browsePlans(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().getBrowsablePlans(
                req.body.dto as GetBrowsablePlansDTO
            ));
        } catch (e) {
            next(e);
        }
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

    @Dto(UpdatePlanMetaDTO)
    public static async updatePlanMeta(req: Request, res: Response, next: NextFunction) {
         try {
             res.status(200).json(await PlansComponent.build().updatePlanMeta(
                 req.body.dto as UpdatePlanMetaDTO
             ));
         } catch (e) {
             next(e);
         }
    }

    public static async deletePlan() { // TODO: Implement Later
    }

    @Dto(AddWeekNodeDTO)
    public static async addWeekToPlan(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().addWeekToPlan(
                req.body.dto as AddWeekNodeDTO
            ));
        } catch (e) {
            next(e);
        }
    }

    @Dto(AddDayNodeDTO)
    public static async addDayToWeek(req: Request, res: Response, next: NextFunction) {
         try {
             res.status(200).json(await PlansComponent.build().addDayToWeek(
                 req.body.dto as AddDayNodeDTO
             ));
         } catch (e) {
             next(e);
         }
    }

    @Dto(AddBlockNodeDTO)
    public static async addBlockToDay(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().addBlockToDay(
                req.body.dto as AddBlockNodeDTO
            ));
        } catch (e) {
            next(e);
        }
    }

    @Dto(AddItemNodeDTO)
    public static async addItemToBlock(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().addItemToBlock(
                req.body.dto as AddItemNodeDTO
            ));
        } catch (e) {
            next(e);
        }
    }

    @Dto(UpdateWeekNodeDTO)
    public static async updateWeek(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().updateWeek(
                req.body.dto as UpdateWeekNodeDTO
            ));
        } catch (e) {
            next(e);
        }
    }

    public static async updateDay() {
    }

    public static async updateBlock() {
    }

    public static async updateItem() {
    }

    public static async getFullPlan() {
    }

    @Dto(PublishPlanDTO)
    public static async publishPlan(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PlansComponent.build().publishPlan(
                req.body.dto as PublishPlanDTO
            ));
        } catch (e) {
            next(e);
        }
    }
}