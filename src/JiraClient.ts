import { json } from "express";
import got, { RequestError } from "got";

export default class JiraClient {
  private authToken: string;
  private authHeader: string;
  constructor(
    private jiraHost: string,
    private jiraUser: string,
    private jiraToken: string
  ) {
    this.authToken = Buffer.from(this.jiraUser + ":" + this.jiraToken).toString(
      "base64"
    );
    this.authHeader = "Basic " + this.authToken;
  }

  private async jiraRequest(path: string): Promise<JiraApiReturn<unknown>> {
    const req = got("https://" + this.jiraHost + path, {
      headers: {
        Authorization: this.authHeader,
      },
    });

    //TODO: define how we want to handle errors through the app!
    const body = await req.json();
    return body as JiraApiReturn<unknown>;
  }

  async getBoards() {
    const result = await this.jiraRequest("/rest/agile/1.0/board");
    return result;
  }

  async getBoard(boardId: string) {
    const result = await this.jiraRequest(`/rest/agile/1.0/board${boardId}`);
    return result;
  }

  async getSprints(boardIds: Array<String>): Promise<JiraApiReturn<unknown>> {
    try {
      return this.jiraRequest(`/rest/agile/1.0/board/${boardIds}/sprint`);
    } catch (e: any) {
      console.log("getSprints error", e.response.statusCode);
      return JSON.parse(e.response.statusCode);
    }
  }

  async getIssues(boardId: string) {
    const result = await this.jiraRequest(
      `/rest/agile/1.0/board/${boardId}/issue`
    );
    return result;
  }
}
