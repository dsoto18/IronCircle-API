import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware, AuthRequest } from "../../middleware/authMiddleware";
import { Dto } from "../../shared/dto";
import { CreateFeaturePostDTO } from "./DTOs/create-feature-post.dto";
import { ExplorePostsComponent } from "./explore-posts-component";

export class ExplorePostsRoutehandler {
    public static build(): Router {
        const router = Router();

        router.post("/featured", authMiddleware, this.createFeaturePost);
        router.get("/featured", authMiddleware, this.getFeaturedPosts);

        return router;
    }

    @Dto(CreateFeaturePostDTO)
    public static async createFeaturePost(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            req.body.dto.userId = req.user?.sub;
            res.status(200).json(await ExplorePostsComponent.build().createPost(
                req.body.dto as CreateFeaturePostDTO
            ));
        } catch(e) {
            next(e);
        }
    }

    public static async getFeaturedPosts(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const requester = req.user!.sub;
            res.status(200).json(await ExplorePostsComponent.build().getFeaturedPosts(requester));
        } catch(e) {
            next(e);
        }
    }
}