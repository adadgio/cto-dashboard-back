import { Router, RequestHandler } from 'express';
import JiraClient from '../JiraClient';

const TodoHandler: RequestHandler = (req, res) => res.send("TODO");

const routeFactory = (jiraClient: JiraClient) => {
  const router = Router();

  router.get('/projectList', TodoHandler); 
  router.get('/sprintList', TodoHandler);
  router.get('/issueList', TodoHandler);

  return router;
}

export default routeFactory;

