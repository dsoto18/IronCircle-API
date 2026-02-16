import { Router, Request, Response } from "express";

export class PostsRoutehandler {
    public static build(): Router {
        const router = Router();

        router.get("/posts", this.getPosts);
        router.get("/post/:postId", this.getPost);
        router.patch("/post/:postId", this.updatePost);
        router.delete("/post/:postId", this.deletePost);

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
}