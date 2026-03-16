import { Router, Request, Response, NextFunction } from "express";
import { Dto } from "../../shared/dto";
import { CreatePostDTO } from "./DTOs/create-post.dto";
import { PostsComponent } from "./posts-component";
import { GetUsersPostsDTO } from "./DTOs/get-users-posts.dto";
import { UpdatePostDTO } from "./DTOs/update-post.dto";

export class PostsRoutehandler {
    public static build(): Router {
        const router = Router();

        router.post("/:userId/posts", this.createPost);
        router.get("/:userId/posts", this.getUsersPosts);
        router.get("/post/:postId", this.getPost);
        router.patch("/post/:postId", this.updatePost);
        router.delete("/post/:postId", this.deletePost);
        router.get("/post/:postId/comments", this.getComments);
        router.post("/post/:postId/comments", this.addComment);
        router.patch("/post/:postId/comments", this.updateComment);
        router.delete("/post/:postId/comments", this.deleteComment);
        router.get("/post/:postId/likes", this.getLikes);
        router.post("/post/:postId/likes", this.addLike);
        router.delete("/post/:postId/likes", this.removeLike);

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

    // TODO: Might Not Need!!
    public static getPost(req: Request, res: Response) {
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

    public static getLikes(req: Request, res: Response){
        return res.json({ message: "Get Likes"});
    }

    public static addLike(req: Request, res: Response){
        return res.json({ message: "Add Like"});
    }

    public static removeLike(req: Request, res: Response){
        return res.json({ message: "Remove Like"});
    }
}