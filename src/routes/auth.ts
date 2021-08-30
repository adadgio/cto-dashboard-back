import { Router, RequestHandler } from 'express';

const TodoHandler: RequestHandler = (req, res) => res.send("TODO");

const routeFactory = (authService: any) => {
  const router = Router();

  router.post('/login', TodoHandler);

  return router;
}

export default routeFactory;

