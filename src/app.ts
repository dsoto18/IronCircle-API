import express, { Request, Response } from 'express';
import { UserRouteHandler } from './modules/user/user-routehandler';
import { PostsRoutehandler } from './modules/post/posts-routehandler';

const app = express();
const port = 3000;

app.use(UserRouteHandler.build());
app.use(PostsRoutehandler.build());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from the Iron Circle API!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

