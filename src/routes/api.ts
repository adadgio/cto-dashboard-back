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

    const projectIds = (req.query.projectIds as string).split(",").map(Number);
 
    try {
      // const jiraSprintsPromises = projectIds.map(id => jiraClient.getSprintsOfBoard(id));
      // const jiraSprints = await waitAndFlatten(jiraSprintsPromises);
      // const sprints = translators.jiraSprints(jiraSprints);

      const result = await dashboardRepositorySingleton.fetchProjectSprintList(projectIds)

      return res.json(result);
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  router.get('/issueList', async (req:Request, res:Response, next: NextFunction)=>{
    if (!req.query.sprintIds)
      return res.status(500).json(new ApiError("No sprintIds provided"));

    const sprintIds = (req.query.sprintIds as string).split(",").map(Number);

    try {
      // const jiraIssuesQueriesPromises = boardIds.map(id => jiraClient.getIssuesOfBoard(id));
      // const jiraIssues = await waitAndFlatten(jiraIssuesQueriesPromises);
      const result = await dashboardRepositorySingleton.fetchIssuesList(sprintIds);
      // const issues = translators.jiraIssues(jiraIssues);
      return res.json(result);
    } catch(e: any) {
      next(new ApiError(e));
    }
  });

  return router;
};

export default routeFactory;
