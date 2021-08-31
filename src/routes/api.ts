import { Router, RequestHandler, Request, Response } from 'express';
import JiraClient from '../JiraClient';
import { jiraSprintsToSprints } from '../services/JiraDataTranslators'


const routeFactory = (jiraClient: JiraClient) => {
  const router = Router();

  /**
   * @returns all boards
   */
  router.get('/projectList', async (req:Request, res:Response)=>{
    //TODO: return appropriate response to board not found.
    const boards = await jiraClient.getBoards();

    return res.json(boards);
  });

  /**
   * @returns all sprints according to boardList.
   */
  router.get('/sprintList', async (req:Request, res:Response)=>{
    if (!req.query.boardIds)
      return res.status(500).json({error: "No board id provided"});

    const boardIds = (req.query.boardIds as string).split(",");

    try {
      const jiraSprints = await jiraClient.getSprints(boardIds);
      const sprints = jiraSprintsToSprints(jiraSprints);

      return res.json(sprints);
    } catch(e) {
      console.error(e);
      //TODO: error handling;
      res.send(500);
    }
  });

  router.get('/issueList', async (req:Request, res:Response)=>{
    return res.json(await jiraClient.getIssues(req.params.boardId));
  });

  return router;
}

export default routeFactory;

