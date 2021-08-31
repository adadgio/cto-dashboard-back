import got from 'got';
import { JiraApiReturnIssues, JiraApiReturnValues, JiraSprint } from '../../types/Jira';

export default class JiraClient {
  private authToken: string;
  private authHeader: string;
  constructor (
    private jiraHost: string,
    private jiraUser: string,
    private jiraToken: string,
  ) {
    this.authToken = Buffer.from( this.jiraUser + ":" + this.jiraToken).toString("base64");
    this.authHeader = "Basic " + this.authToken;
  }

  private async jiraRequest<T>(path: string): Promise<T> {
    const req = got('https://' + this.jiraHost + path, {
      headers: {
        Authorization: this.authHeader
      }
    })

    const body: T = await req.json();
    return body;
  }

  async getBoards() {
    const result = await this.jiraRequest<JiraApiReturnValues<any>>('/rest/agile/1.0/board');
    return result;
  }

  async getBoard(boardId: string) {
    const result = await this.jiraRequest<JiraApiReturnValues<any>>(`/rest/agile/1.0/board${boardId}`);
    return result;
  }

  async getSprints(boardIds: number[]): Promise<JiraSprint[]> {
    const sprintPromises = boardIds.map( boardId => this.jiraRequest<JiraApiReturnValues<JiraSprint>>(`/rest/agile/1.0/board/${boardId}/sprint`) );

    //TODO: handle pagination
    const results = await Promise.all(sprintPromises);
    const jiraSprints = results.flatMap(result => result.values)
    return jiraSprints;
  }

  async getIssues(boardId: string) {
    console.log("getIssues", boardId);
    const result = await this.jiraRequest<JiraApiReturnIssues<any>>(`/rest/agile/1.0/board/${boardId}/issue`);
    return result;
  }
}
