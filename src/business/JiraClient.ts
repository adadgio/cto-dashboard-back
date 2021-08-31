import got from 'got';
import { JiraApiReturn, JiraIssues, JiraSprint } from '../../types/Jira';

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

  private async jiraRequest<T>(path: string): Promise<JiraApiReturn<T>> {
    const req = got('https://' + this.jiraHost + path, {
      headers: {
        Authorization: this.authHeader
      }
    })

    const body: JiraApiReturn<T> = await req.json();
    return body;
  }

  async getBoards() {
    const result = await this.jiraRequest('/rest/agile/1.0/board');
    return result;
  }

  async getBoard(boardId: string) {
    const result = await this.jiraRequest(`/rest/agile/1.0/board${boardId}`);
    return result;
  }

  async getSprints(boardIds: number[]): Promise<JiraSprint[]> {
    const sprintPromises = boardIds.map( boardId => this.jiraRequest<JiraSprint>(`/rest/agile/1.0/board/${boardId}/sprint`) );

    //TODO: handle pagination
    const results = await Promise.all(sprintPromises);
    const jiraSprints = results.flatMap(result => result.values)
    return jiraSprints;
  }

  async getIssues(projectIds: number[]): Promise<JiraIssues[]> {
    const issuesPromises = projectIds.map(pId => this.jiraRequest<JiraIssues>(`/rest/agile/1.0/board/${pId}/issue`));
    const results = await Promise.all(issuesPromises);

    const jiraIssues = results.flatMap(result => result.issues);

    return jiraIssues;
  }
}
