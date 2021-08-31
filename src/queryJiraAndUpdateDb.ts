import conf from './ConfigurationSingleton';
import JiraClient from './business/JiraClient';
import * as translators from './business/JiraDataTranslators';

const main = async () => {
  const jiraClient = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);

  console.log("querying boards");
  const jiraBoards = await jiraClient.getBoards();
  //TODO: process/translate boards data?
  //
  const boardIds = jiraBoards.map(board => board.id);

  console.log("querying issues");
  const jiraIssuesQueriesPromises = boardIds.map(id => jiraClient.getIssuesOfBoard(id));
  const jiraIssuesQueries = await Promise.all(jiraIssuesQueriesPromises);
  const jiraIssues = jiraIssuesQueries.flat();

  const issues = translators.jiraIssuesToIssues(jiraIssues);

  console.log("all issues over", jiraBoards.length, "boards:");
  console.log(issues);
  //TODO: send to database

}

main();

