import express, { Request, Response } from 'express';
import { UserRouteHandler } from './modules/user/user-routehandler';
import { PostsRoutehandler } from './modules/post/posts-routehandler';
import { ErrorParser } from './shared/error-parse';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(UserRouteHandler.build());
app.use(PostsRoutehandler.build());

app.use(ErrorParser);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from the Bluepnt API!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

