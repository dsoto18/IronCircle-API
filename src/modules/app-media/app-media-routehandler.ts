import { NextFunction, Response, Router } from "express";
import { authMiddleware, AuthRequest } from "../../middleware/authMiddleware";
import { AppMediaComponent } from "./app-media-component";
import { Dto } from "../../shared/dto";
import { GenerateUploadUrlDTO } from "./DTOs/GenerateUploadURL.dto";


export class AppMediaRoutehandler {

    public static build(): Router {
        const router = Router();

        router.post("/media/upload-url", authMiddleware, this.generateUploadUrl);

        return router;
    }

    @Dto(GenerateUploadUrlDTO)
    public static async generateUploadUrl(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const userId = req.user?.sub;
            res.status(200).json(await AppMediaComponent.build().generatePresignedUrl(
                {...req.body.dto, userId} as GenerateUploadUrlDTO
            ));
        } catch(e) {
            next(e);
        }
    }
}