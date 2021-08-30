import { Router, RequestHandler } from 'express';

const TodoHandler: RequestHandler = (req, res) => res.send("TODO");

const routeFactory = (authService: any) => {
  const router = Router();

  router.get('projectList', TodoHandler); 
  router.get('sprintList', TodoHandler);
  router.get('issueList', TodoHandler);

  return router;
}

export default routeFactory;

