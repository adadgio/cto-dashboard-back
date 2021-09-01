import {Issue} from '@cto-dashboard-model/cto-dashboard-model';
import neo4j, { Driver, Session } from 'neo4j-driver';

import conf from './ConfigurationSingleton';

class DashboardRepository {
  driver: Driver;
  session: Session;

  constructor() {
    console.info("connecting to database");
    const driver = this.driver = neo4j.driver(
      conf.neo4jHost,
      neo4j.auth.basic(conf.neo4jUsername, conf.neo4jPassword)
    )

    const session = this.session = driver.session({
      database: conf.neo4jDatabase,
      defaultAccessMode: neo4j.session.WRITE
    })

    this.setSchema();
  }

  private async setSchema() {
    console.info("setting schema");

    await this.session.run('CREATE CONSTRAINT unique_issue_id IF NOT EXISTS ON (n:Issue) ASSERT n.id IS UNIQUE')
    await this.session.run('CREATE CONSTRAINT unique_board_id IF NOT EXISTS ON (n:Board) ASSERT n.id IS UNIQUE')
  }

  close() {
    return this.driver.close();
  }

  async addIssuesAndBoards (issues: Issue[])  {
  const transaction = this.session.beginTransaction();

    const result = await Promise.all(
      issues.map(issue => {
        const queries = [ 'MERGE (i:Issue {id: $id, name: $name}) SET i.status = $status' ];
        if (issue.boardId) {
          queries.push('MERGE (:Board {id: $boardId})');
          queries.push(`
           MATCH (i:Issue {id: $id})
           MATCH (b:Board {id: $boardId})
           MERGE (i)-[:BELONGS_TO]->(b)
         `)
        }

        console.info("merging issue", issue.id, "to board id", issue.boardId, "with query", queries);
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
  }

  async addBoard(board: any) {
    // `SET board = $board` will assign all props in the board object to the node
    await this.session.run("MERGE (b:Board {id: $board.id}) SET b = $board", {
      board: {
        id: board.id.toString(), //neo4j automatically converts ints to float
        name: board.name,
        projectId: board.location?.projectId.toString() || null //TODO: translate board and get projects?
      }
    });

    //TODO: understand Jira's model. Do boards always have a project? What is a `location`?
    if (board.location?.projectId) {
      await this.session.run("MERGE (p:Project {id: $project.id}) SET p = $project", {
        project: {
          id: board.location.projectId.toString(),
          name: board.location.name
        }
      })

      await this.session.run({
        text: `
          MATCH (b:Board {id: $boardId})
          MATCH (p:Project {id: $projectId})
          MERGE (b)-[:BELONGS_TO]->(p)
        `,
        parameters: {
          boardId: board.id.toString(),
          projectId: board.location.projectId.toString(),
        }
      })
    }

  }

  async countIssuesWithStatus(status: "Done" | "To Do" | "In Progress"): Promise<number> {
    const result = await this.session.run('MATCH (n:Issue {status: $status}) RETURN count(n)', {status});
    return result.records[0].get('count(n)');
  }

  async countIssuesWithType(type: "Bug" | "Feature"): Promise<number> {
    const result = await this.session.run('MATCH (n:Issue {type: $type}) RETURN count(n)', {type});
    return result.records[0].get('count(n)');
  }
}

const dashboardRepositorySingleton = new DashboardRepository();
export default dashboardRepositorySingleton;

