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


  console.info("boards:", jiraBoards.map(e => ({id: e.id, pId: e.location.projectId, name: e.name})));
  console.info("number of issues:", issues.length);
  issues.forEach(e => console.debug(JSON.stringify({id: e.id, pId: e.projectId, name: e.name})) );
  console.info("number of sprints:", sprints.length);
  sprints.forEach(e => console.debug(JSON.stringify({id: e.id, bId: e.boardId, name: e.name})) );


  for (let board of jiraBoards) {
    await dashboardRepositorySingleton.addBoard(board);
  }

  for (let sprint of sprints) {
    await dashboardRepositorySingleton.addSprint(sprint);
  }

  await dashboardRepositorySingleton.addIssuesAndBoards(issues)

  console.log("nb bugs:", await dashboardRepositorySingleton.countIssuesWithType("Bug"));
  console.log("nb done:", await dashboardRepositorySingleton.countIssuesWithStatus("Done"));
  console.log("nb in progress:", await dashboardRepositorySingleton.countIssuesWithStatus("In Progress"));
  console.log("nb todo:", await dashboardRepositorySingleton.countIssuesWithStatus("To Do"));

  console.log("done");
  await dashboardRepositorySingleton.close();
}

main();

