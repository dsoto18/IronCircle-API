import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";


export class AppMediaRoutehandler {

    public static build(): Router {
        const router = Router();

        router.post("/media/upload-url", authMiddleware, this.generateUploadUrl);

        return router;
    }

    public static async generateUploadUrl(){

    }
}