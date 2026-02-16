import { Router, Request, Response } from "express";

export class PostsRoutehandler {
    public static build(): Router {
        const router = Router();

        router.get("/posts", this.getPosts);
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

    public static getPosts(req: Request, res: Response) {
        return res.json({ message: "Get Posts"});
    }

    public static getPost(req: Request, res: Response) {
        return res.json({ message: "Get Post"});
    }

    public static updatePost(req: Request, res: Response) {
        return res.json({ message: "Update Post"});
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