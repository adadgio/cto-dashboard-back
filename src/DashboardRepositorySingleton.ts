import {Issue, Sprint} from '@cto-dashboard-model/cto-dashboard-model';
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
  }

  close() {
    return this.driver.close();
  }

  async addIssuesAndBoards (issues: Issue[])  {
    const transaction = this.session.beginTransaction();

    issues.forEach(issue => {
      transaction.run(`
        MERGE (i:Issue {id: $id})
        MERGE (p:Project {id: $projectId})
        MERGE (i)-[:BELONGS_TO]->(p)
        SET i.name = $name,
            i.status = $status,
            i.type = $type
      `, issue);

      transaction.run(`
        MATCH (i:Issue {id: $id})
        UNWIND $allSprintIds AS sprintId
        MERGE (s:Sprint {id: sprintId})
        MERGE (i)-[:BELONGS_TO]->(s)
      `, issue);
    })

    return await transaction.commit();
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

  async addSprint(sprint: Sprint) {
    const {id, boardId, ...data} = sprint;

    await this.session.run({
      text: `
        MERGE (b:Board {id: $boardId})
        MERGE (s:Sprint {id: $id})
        MERGE (s)-[:BELONGS_TO]->(b)
        WITH s
        UNWIND $data as properties
        SET s = properties,
            s.id = $id
      `,
      parameters: {
        id: id.toString(),
        boardId: boardId?.toString(),
        data
      }
    })
  }


  async countBugsTodo(projectId: string): Promise<number> {
    const result = await this.session.run(`
      MATCH (:Project {id: $projectId})<-[:BELONGS_TO]-(n:Issue {type: "Bug"})
      WHERE NOT n.status = "Done"
      RETURN count(n)
      `, {projectId});

    return result.records[0].get('count(n)').toInt();
  }

  async countBugsDone(projectId: string): Promise<number> {
    const result = await this.session.run(`
      MATCH (:Project {id: $projectId})<-[:BELONGS_TO]-(n:Issue {type: "Bug", status: "Done"})
      RETURN count(n)
      `, {projectId});

    return result.records[0].get('count(n)').toInt();
  }

  async countTasksTodo(projectId: string): Promise<number> {
    const result = await this.session.run(`
      MATCH (:Project {id: $projectId})<-[:BELONGS_TO]-(n:Issue {status: "Done"})
      WHERE NOT n.type = "Bug"
      RETURN count(n)
      `, {projectId});

    return result.records[0].get('count(n)').toInt();
  }

  async countTasksDone(projectId: string): Promise<number> {
    const result = await this.session.run(`
      MATCH (:Project {id: $projectId})<-[:BELONGS_TO]-(n:Issue)
      WHERE NOT n.type = "Bug" AND NOT n.status = "Done"
      RETURN count(n)
      `, {projectId});

    return result.records[0].get('count(n)').toInt();
  }

  async fetchProjectList() {
    const result = await this.session.run(`
      MATCH (p:Project)
      RETURN p
    `);

    const projects = result.records.map(res => res.get('p').properties);

    const boardsWithCounts = await Promise.all(projects.map(async p => {
      return {
        ...p,
        nbBugsTodo: await this.countBugsTodo(p.id),
        nbBugsDone: await this.countBugsDone(p.id),
        nbFeatureTodo: await this.countTasksTodo(p.id),
        nbFeatureDone: await this.countTasksDone(p.id),
      }
    }));

    return boardsWithCounts;
  }

  async fetchIssuesList(sprintIds: string[]): Promise<Issue[]> {
    const query = await this.session.run(`
        MATCH(s:Sprint)<-[:BELONGS_TO]-(i:Issue)-[:BELONGS_TO]->(p:Project)
        WHERE s.id IN $sprintIds
        RETURN s,collect(i) as issues, p
      `, { sprintIds });

    const issueTab:Issue[] = query.records.map(
      record => record.get('issues').map((issue: any) => {
          return {
            id:issue.properties.id,
            sprintId: record.get('s').properties.id,
            name:issue.properties.name,
            status:issue.properties.status,
            type:issue.properties.type,
            projectId:record.get('p').properties.id,
            allSprintIds:sprintIds.map(Number)
          }
        })
    ).flat();

    return issueTab;
  }

  async fetchProjectSprintList(projectIds: string[]): Promise<Sprint[]> {
    const query = await this.session.run(`
      MATCH(p:Project)<-[:BELONGS_TO]-(b:Board)<-[:BELONGS_TO]-(s:Sprint)
      WHERE p.id IN $projectIds
      RETURN p AS project,
             b AS board,
             collect(s) AS sprintByBoard
      `,
      { projectIds });

    const projectSprintList:Sprint[] = query.records.map(
      record => record.get('sprintByBoard').map((sprint: any) => {
        return {
          id: sprint.properties.id,
          name: sprint.properties.name,
          projectId: record.get('project').properties.id,
          startDate: sprint.properties.startDate,
          endDate: sprint.properties.endDate,
          completeDate: sprint.properties.completeDate,
        };
      })
    ).flat();

    return projectSprintList;
  }
}

const dashboardRepositorySingleton = new DashboardRepository();
export default dashboardRepositorySingleton;

