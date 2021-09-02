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


  async countIssuesWithStatus(status: "Done" | "To Do" | "In Progress"): Promise<number> {
    const result = await this.session.run('MATCH (n:Issue {status: $status}) RETURN count(n)', {status});
    return result.records[0].get('count(n)');
  }

  async countIssuesWithType(type: "Bug" | "Feature"): Promise<number> {
    const result = await this.session.run('MATCH (n:Issue {type: $type}) RETURN count(n)', {type});
    return result.records[0].get('count(n)');
  }

  async fetchProjectList() {
    const result = await this.session.run(`
      MATCH (p:Project)
      RETURN p
    `);

    const boards = result.records.map(res => res.get('p').properties);

    //TODO: get the number of bugs/features todo/done
    return boards.map(b => {
      return {
        ...b,
        nbBugsTodo: 0,
        nbBugsDone: 0,
        nbFeatureTodo: 0,
        nbFeatureDone: 0,
      }
    });
  }

  async fetchIssuesList(boardIds:number[]){
      const query = await this.session.run('MATCH (s:Sprint)<-[BELONGS_TO]-(i:Issue) WHERE s.id IN $tabId RETURN s.id AS sId, s.name AS sName, collect({id:i.id, name:i.name, status:i.status, type:i.type}) as issues', {tabId:boardIds.map(String)})
      try{
            const issueTab:Issue[] = query.records.map(record =>{
                let issueArray:Issue[] = [];
                for(const issue of record.get('issues')){
                  issueArray.push(<Issue>{
                    id:issue.id,
                    sprintId: record.get('sId'),
                    name:issue.name,
                    status:issue.status,
                    type:issue.type
                  })
                }
              return issueArray;
            } 
            ).flat();
        return issueTab;
      }catch(e:any){
        console.log(e);
        return e;
      }
  }
}

const dashboardRepositorySingleton = new DashboardRepository();
export default dashboardRepositorySingleton;

