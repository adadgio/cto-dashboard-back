import { Router, RequestHandler } from "express";
import JiraClient from "../JiraClient";
import {
  Project,
  Sprint,
  Issue,
} from "@cto-dashboard-model/cto-dashboard-model";

const ProjectListHandler: RequestHandler = (req, res) => {
  try {
    res.send([
      new Project({
        name: "Project fixture 1",
        nbBugsDone: 1,
        nbBugsTodo: 2,
        nbFeatureDone: 6,
        nbFeatureTodo: 4,
      }),
      new Project({
        name: "Project fixture 2",
        nbBugsDone: 5,
        nbBugsTodo: 3,
        nbFeatureDone: 6,
        nbFeatureTodo: 1,
      }),
    ]);
  } catch (error) {
    res.status(401).send(error);
  }
};

const SprintListHandler: RequestHandler = (req, res) => {
  try {
    res.send([
      new Sprint({ id: 1, boardId: 3, name: "Sprint de l'été (tranquille)" }),
      new Sprint({ id: 2, boardId: 3, name: "Sprint de l'hiver" }),
      new Sprint({ id: 3, boardId: 2, name: "Sprint du printemps" }),
      new Sprint({ id: 4, boardId: 1, name: "Sprint de l'automne" }),
    ]);
  } catch (error) {
    res.status(401).send(error);
  }
};

const IssueListHandler: RequestHandler = (req, res) => {
  try {
    res.send([
      new Issue({
        id: 1,
        name: "Y'a un bug sur mon écran la",
        status: "Todo",
        type: "Bug",
      }),
      new Issue({
        id: 2,
        name: "Le client est moyen content",
        status: "Done",
        type: "Feature",
      }),
      new Issue({
        id: 3,
        name: "Blackscreen au formulaire",
        status: "Todo",
        type: "Feature",
      }),
    ]);
  } catch (error) {
    res.status(401).send(error);
  }
};

const routeFactory = (jiraClient: JiraClient) => {
  const router = Router();

  router.get("/projectList", ProjectListHandler);
  router.get("/sprintList", SprintListHandler);
  router.get("/issueList", IssueListHandler);

  return router;
};

export default routeFactory;
