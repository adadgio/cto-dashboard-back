import { Router, RequestHandler, Request, Response } from 'express';
import JiraClient from '../JiraClient';
import SprintTranslator from '../translators/SprintTranslator';

const routeFactory = (jiraClient: JiraClient) => {
  const router = Router();

  /**
   * @returns all boards
   */
  router.get('/projectList', async (req:Request, res:Response)=>{
    //TODO: return appropriate response to board not found.
    const result = await jiraClient.getBoards();
    return res.json(result);
  });

  /**
   * @returns all sprints according to boardList.
   */
  router.get('/sprintList', async (req:Request, res:Response)=>{
    const boardIds:Array<string> = (req.query.boardList as string).split(",");

    const {values} = await jiraClient.getSprints(boardIds);

    new SprintTranslator().translateMulti(values as JiraSprint[]);
    return res.json();
  });

  router.get('/issueList', async (req:Request, res:Response)=>{
    return res.json(await jiraClient.getIssues(req.params.boardId));
  });

  return router;
};

export default routeFactory;
