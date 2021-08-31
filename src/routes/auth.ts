import { Router, RequestHandler } from 'express';

const TodoHandler: RequestHandler = (req, res) => res.send("TODO");

const routeFactory = (authService: any) => {
  const router = Router();

  router.get('/login', TodoHandler); 
  router.get('/refresh', TodoHandler);

  return router;
}

export default routeFactory;

