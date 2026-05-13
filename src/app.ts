import express, { Request, Response } from 'express';
import { UserRouteHandler } from './modules/user/user-routehandler';
import { PostsRoutehandler } from './modules/post/posts-routehandler';
import { ErrorParser } from './shared/error-parse';
import { PlansRoutehandler } from './modules/plan/plans-routehandler';
import { ExplorePostsRoutehandler } from './modules/explore-posts/explore-posts-routehandler';
import { AppMediaRoutehandler } from './modules/app-media/app-media-routehandler';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(UserRouteHandler.build());
app.use(PostsRoutehandler.build());
app.use(PlansRoutehandler.build());
app.use(ExplorePostsRoutehandler.build());
app.use(AppMediaRoutehandler.build());

app.use(ErrorParser);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from the Bluepnt API!');
});
// for alb health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

