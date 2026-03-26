import { Router, Request, Response, NextFunction } from "express";
import { Dto } from "../../shared/dto";
import { CreatePostDTO } from "./DTOs/create-post.dto";
import { PostsComponent } from "./posts-component";
import { GetUsersPostsDTO } from "./DTOs/get-users-posts.dto";
import { UpdatePostDTO } from "./DTOs/update-post.dto";
import { GetFeedDTO } from "./DTOs/get-feed.dto";
import { GetLikesDTO } from "./DTOs/get-likes.dto";
import { AddLikeDTO } from "./DTOs/add-like.dto";

export class PostsRoutehandler {
    public static build(): Router {
        const router = Router();

        router.post("/:userId/posts", this.createPost);
        router.get("/:userId/posts", this.getUsersPosts);
        router.get("/post/:postId", this.getPost);  // Might Leave Out
        router.patch("/post/:postId", this.updatePost); // Implement Later
        router.delete("/post/:postId", this.deletePost); // Implement Later

        // ----------- TODO: Implement Comments in V2 ---------------------
        router.get("/post/:postId/comments", this.getComments);
        router.post("/post/:postId/comments", this.addComment);
        router.patch("/post/:postId/comments", this.updateComment);
        router.delete("/post/:postId/comments", this.deleteComment);
        // ----------------------------------------------------------------

        router.get("/post/:postId/likes", this.getLikes);
        router.post("/likes/:postId", this.addLike);
        router.delete("/likes/:postId", this.removeLike);

        // FEED
        router.get("/feed/:userId", this.getFeed);

        return router;
    }

    @Dto(CreatePostDTO)
    public static async createPost(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await PostsComponent.build().createPost(
                req.body.dto as CreatePostDTO
            ));
        }
        catch (e) {
            next(e);
        }
    }

    @Dto(GetUsersPostsDTO)
    public static async getUsersPosts(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PostsComponent.build().getUsersPosts(
                req.body.dto as GetUsersPostsDTO
            ));
        } catch(e) {
            next(e);
        }
    }

    // Important Note: Might Not Need!!
    public static getPost(req: Request, res: Response) {
        // TODO: Get a single post
        return res.json({ message: "Get Post"});
    }

    @Dto(UpdatePostDTO)
    public static async updatePost(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await PostsComponent.build().updatePost(
                req.body.dto as UpdatePostDTO
            ));
        } catch (e) {
            next(e);
        }
    }

    public static deletePost(req: Request, res: Response) {
        return res.json({ message: "Delete Post"});
    }

    public static getComments(req: Request, res: Response){
        return res.json({ message: "Get Comments"});
    }

    public static addComment(req: Request, res: Response){
        return res.json({ message: "Add Comment"});
    }

    public static updateComment(req: Request, res: Response){
        return res.json({ message: "Update Comment"});
    }

    public static deleteComment(req: Request, res: Response){
        return res.json({ message: "Delete Comment"});
    }

    @Dto(GetLikesDTO)
    public static async getLikes(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await PostsComponent.build().getLikes(
                req.body.dto as GetLikesDTO
            ))
        } catch (e) {
            next(e);
        }
    }

    @Dto(AddLikeDTO)
    public static async addLike(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await PostsComponent.build().addLike(
                req.body.dto as AddLikeDTO
            ))
        } catch (e) {
            next(e);
        }
    }

    @Dto(AddLikeDTO) // same content, so reusing for now
    public static async removeLike(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await PostsComponent.build().removeLike(
                req.body.dto as AddLikeDTO
            ))
        } catch(e) {
            next(e);
        }
    }

    // USER FEED
    @Dto(GetFeedDTO)
    public static async getFeed(req: Request, res: Response, next: NextFunction){
        try {
            res.status(200).json(await PostsComponent.build().getFeed(
                req.body.dto as GetFeedDTO
            ))
        } catch(e) {
            next(e);
        }
    }
}