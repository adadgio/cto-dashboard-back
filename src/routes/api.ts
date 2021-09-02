import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import JiraClient from '../business/JiraClient';
import * as translators from '../business/JiraDataTranslators'
import ApiError from '../ApiError';
import {waitAndFlatten} from '../utils';
import dashboardRepositorySingleton from '../DashboardRepositorySingleton';


const routeFactory = (jiraClient: JiraClient) => {
  const router = Router();

  /**
   * @returns all boards
   */
  router.get('/projectList', async (req:Request, res:Response, next: NextFunction)=>{
    try {
      const boards = await dashboardRepositorySingleton.fetchProjectList();

      return res.json(boards);
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  /**
   * @returns all sprints according to boardList.
   */
  router.get('/sprintList', async (req:Request, res:Response, next: NextFunction)=>{
    if (!req.query.projectIds)
      return res.status(500).json(new ApiError("No projectIds provided"));
 
    try {
      const projectIds = (req.query.projectIds as string).split(",");
      const result = await dashboardRepositorySingleton.fetchProjectSprintList(projectIds)

      return res.json(result);
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  router.get('/issueList', async (req:Request, res:Response, next: NextFunction)=>{
    if (!req.query.sprintIds)
      return res.status(500).json(new ApiError("No sprintIds provided"));


    try {
      const sprintIds = (req.query.sprintIds as string).split(",");
      const result = await dashboardRepositorySingleton.fetchIssuesList(sprintIds);

      return res.json(result);
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  return router;
};

export default routeFactory;
