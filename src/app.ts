import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from the Iron Circle API!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
