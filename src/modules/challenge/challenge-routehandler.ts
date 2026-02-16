import { Router, Request, Response } from "express";

export class ChallengeRoutehandler {
    public static build(): Router {
        const router = Router();

        router.get("/challenges", this.searchChallenges);
        router.get("/challenge/:id", this.getChallenge);
        router.post("/challenge", this.createChallenge);
        router.patch("/challenge/:id", this.updateChallenge);
        router.delete("/challenge/:id", this.deleteChallenge);

        return router;
    }

    public static searchChallenges(req: Request, res: Response) {
        return res.json({ message: "Get Challenge"});
    }

    public static getChallenge(req: Request, res: Response) {
        return res.json({ message: "Get Challenge"});
    }

    public static createChallenge(req: Request, res: Response) {
        return res.json({ message: "Create Challenge"});
    }

    public static updateChallenge(req: Request, res: Response) {
        return res.json({ message: "Update Challenge"});
    }

    public static deleteChallenge(req: Request, res: Response) {
        return res.json({ message: "Delete Challenge"});
    }
}