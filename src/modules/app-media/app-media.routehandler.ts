import { Router } from "express";


export class AppMediaRoutehandler {

    public static build(): Router {
        const router = Router();

        router.post("/media/upload-url", this.generateUploadUrl);

        return router;
    }

    public static async generateUploadUrl(){

    }
}