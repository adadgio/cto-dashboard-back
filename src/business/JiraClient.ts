import got from 'got';
import { JiraApiReturnIssues, JiraApiReturnValues, JiraSprint, JiraIssue, JiraBoard } from '../../types/Jira';

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
    const result = await this.jiraRequest<JiraApiReturnValues<JiraBoard>>('/rest/agile/1.0/board');
    const boards = result.values;

    return boards;
  }

  async getBoard(boardId: string) {
    const result = await this.jiraRequest<JiraApiReturnValues<any>>(`/rest/agile/1.0/board/${boardId}`);
    return result;
  }

  async getSprintsOfBoard(boardId: number): Promise<JiraSprint[]> {
    //TODO: handle pagination

    const result = await this.jiraRequest<JiraApiReturnValues<JiraSprint>>(`/rest/agile/1.0/board/${boardId}/sprint`);
    const jiraSprints = result.values;

    return jiraSprints;
  }

  async getIssuesOfBoard(boardId: number) {
    //TODO: handle pagination

    const result = await this.jiraRequest<JiraApiReturnIssues<JiraIssue>>(`/rest/agile/1.0/board/${boardId}/issue`);
    const jiraIssues = result.issues;

    return jiraIssues;
  }
}
