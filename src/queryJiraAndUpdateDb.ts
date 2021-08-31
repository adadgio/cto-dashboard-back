import conf from './ConfigurationSingleton';
import JiraClient from './business/JiraClient';
import * as translators from './business/JiraDataTranslators';

const main = async () => {
  const jiraClient = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);

  const jiraBoards = await jiraClient.getBoards();
  //TODO: process/translate boards data?
  //
  const boardIds = jiraBoards.map(board => board.id);

  const jiraIssuesQueriesPromises = boardIds.map(id => jiraClient.getIssues(id));
  const jiraIssuesQueries = await Promise.all(jiraBoards);
  const jiraIssues = jiraIssuesQueries.flat();

  const issues = translators.jiraIssues(jiraIssues);

  console.log("all issues over", jiraBoards.length, "boards:");
  console.log(issues);
  //TODO: send to database

}

main();

