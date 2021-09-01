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
  //
  const boardIds = jiraBoards.map(board => board.id);

  console.log("querying JIRA API for issues");
  const jiraIssuesQueriesPromises = boardIds.map(id => jiraClient.getIssuesOfBoard(id));
  const jiraIssues = await waitAndFlatten(jiraIssuesQueriesPromises);

  const issues = translators.jiraIssues(jiraIssues);

  console.log("all issues over", jiraBoards.length, "boards:");
  console.log(issues.map(i => i.id));

  for (let board of jiraBoards) {
    await dashboardRepositorySingleton.addBoard(board);
  }

  await dashboardRepositorySingleton.addIssuesAndBoards(issues)

  console.log("done");
  await dashboardRepositorySingleton.close();
}

main();

