import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import JiraClient from '../business/JiraClient';
import { jiraSprintsToSprints } from '../business/JiraDataTranslators'
import ApiError from '../ApiError';


const routeFactory = (jiraClient: JiraClient) => {
  const router = Router();

  /**
   * @returns all boards
   */
  router.get('/projectList', async (req:Request, res:Response, next: NextFunction)=>{
    try {
      const boards = await jiraClient.getBoards();
      return res.json(boards);
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  /**
   * @returns all sprints according to boardList.
   */
  router.get('/sprintList', async (req:Request, res:Response, next: NextFunction)=>{
    if (!req.query.boardIds)
      return res.status(500).json(new ApiError("No board id provided"));

    const boardIds = (req.query.boardIds as string).split(",").map(Number);

    try {
      const jiraSprints = await jiraClient.getSprints(boardIds);
      const sprints = jiraSprintsToSprints(jiraSprints);

      return res.json(sprints);
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  router.get('/issueList', async (req:Request, res:Response, next: NextFunction)=>{
    try {
      return res.json(await jiraClient.getIssues(Number(req.query.boardId as string)));
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  return router;
}

export default routeFactory;

