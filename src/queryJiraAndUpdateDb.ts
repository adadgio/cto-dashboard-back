import neo4j from 'neo4j-driver';

import conf from './ConfigurationSingleton';
import JiraClient from './business/JiraClient';
import * as translators from './business/JiraDataTranslators';
import { waitAndFlatten } from './utils';

const main = async () => {
  const jiraClient = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);

  console.log("connecting to database");
  const driver = neo4j.driver(
    conf.neo4jHost,
    neo4j.auth.basic(conf.neo4jUsername, conf.neo4jPassword)
  )

  console.log("acquiring session");
  const session = driver.session({
    database: conf.neo4jDatabase,
    defaultAccessMode: neo4j.session.WRITE
  })


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


  console.log("setting schema");
  await session.run('CREATE CONSTRAINT unique_issue_id IF NOT EXISTS ON (n:Issue) ASSERT n.id IS UNIQUE')
  await session.run('CREATE CONSTRAINT unique_board_id IF NOT EXISTS ON (n:Board) ASSERT n.id IS UNIQUE')

  const transaction = session.beginTransaction();


  const result = await Promise.all(
    issues.map(issue => {
      const queries = [ 'MERGE (:Issue {id: $id, name: $name})' ];
      if (issue.boardId) {
        queries.push('MERGE (:Board {id: $boardId})');
        queries.push(`
         MATCH (i:Issue {id: $id})
         MATCH (b:Board {id: $boardId})
         MERGE (i)-[:BELONGS_TO]->(b)
       `)
      }

      console.log("merging issue", issue.id, "to board id", issue.boardId, "with query", queries);
      return Promise.all(
        queries.map(query =>
          transaction.run(query, {
          ...issue,
          boardId: issue.boardId?.toString() || null //neo4j automatically converts ints to float
        })
       )
    )
    })
  );

  await transaction.commit();

  console.log("done");



  await driver.close();
}

main();

