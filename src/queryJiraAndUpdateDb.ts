import conf from './ConfigurationSingleton';
import JiraClient from './business/JiraClient';
import * as translators from './business/JiraDataTranslators';
import { waitAndFlatten } from './utils';
import dashboardRepositorySingleton from './DashboardRepositorySingleton';

const main = async () => {
  const jiraClient = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);


  console.log("querying JIRA API for boards");
  const jiraBoards = await jiraClient.getBoards();
  //TODO: process/translate boards data?
  const boardIds = jiraBoards.map(board => board.id);

  console.log("querying JIRA API for issues");
  const jiraIssuesQueriesPromises = boardIds.map(id => jiraClient.getIssuesOfBoard(id));
  const jiraIssues = await waitAndFlatten(jiraIssuesQueriesPromises);
  const issues = translators.jiraIssues(jiraIssues);

  console.log("querying JIRA API for sprints");
  const jiraSprintsPromises = boardIds.map(id => jiraClient.getSprintsOfBoard(id));
  const jiraSprints = await waitAndFlatten(jiraSprintsPromises);
  const sprints = translators.jiraSprints(jiraSprints);


  console.info("number of boards:", jiraBoards.length);
  console.info("number of issues:", issues.length);
  console.info("number of sprints:", sprints.length);


  for (let board of jiraBoards) {
    console.debug("adding board", {id: board.id, pId: board.location.projectId, name: board.name})
    await dashboardRepositorySingleton.addBoard(board);
  }

  for (let sprint of sprints) {
    console.debug("adding sprint", JSON.stringify({id: sprint.id, boardId: sprint.boardId, name: sprint.name}));
    await dashboardRepositorySingleton.addSprint(sprint);
  }

  console.debug("adding issues");
  issues.forEach(e => console.debug(JSON.stringify({id: e.id, pId: e.projectId, name: e.name})) );
  await dashboardRepositorySingleton.addIssuesAndBoards(issues)


  console.log("nb bugs:", await dashboardRepositorySingleton.countIssuesWithType("Bug"));
  console.log("nb done:", await dashboardRepositorySingleton.countIssuesWithStatus("Done"));
  console.log("nb in progress:", await dashboardRepositorySingleton.countIssuesWithStatus("In Progress"));
  console.log("nb todo:", await dashboardRepositorySingleton.countIssuesWithStatus("To Do"));

  console.log("done");
  await dashboardRepositorySingleton.close();
}

main();

