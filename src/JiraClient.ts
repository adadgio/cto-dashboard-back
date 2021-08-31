import { json } from 'express';
import got, { RequestError } from 'got';
import { JiraApiReturn, JiraSprint } from '../types/Jira';

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

    //TODO: define how we want to handle errors through the app!
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

  async getSprints(boardIds: String[]): Promise<JiraSprint[]> {
    const sprintPromises = boardIds.map( boardId => this.jiraRequest<JiraSprint>(`/rest/agile/1.0/board/${boardId}/sprint`) );

    try {
      //TODO: handle pagination
      const results = await Promise.all(sprintPromises);
      const jiraSprints = results.flatMap(result => result.values)
      return jiraSprints;
    } catch(e: any) {
      console.log("getSprints error", e.response.statusCode);
      return JSON.parse(e.response.statusCode);
    }
  }

  async getIssues(boardId: string) {
    const result = await this.jiraRequest(`/rest/agile/1.0/board/${boardId}/issue`);
    return result;
  }
}
