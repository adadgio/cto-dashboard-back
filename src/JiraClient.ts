import { json } from 'express';
import got, { RequestError } from 'got';

export default class JiraClient {
  constructor (
    private jiraHost: string,
    private jiraUser: string,
    private jiraToken: string,
  ) {
  }

  private async jiraRequest(path: string) {
    return got('https://' + this.jiraHost + path, {
      headers: {
        Authorization: `Basic ${
          Buffer.from(
            process.env.JIRA_USER+":"+process.env.JIRA_TOKEN
          ).toString("base64")
        }`
      }
    }).json()
  }

  async getBoards() {
    const result = await this.jiraRequest('/rest/agile/1.0/board');
    return result;
  }

  async getBoard(boardId: string) {
    const result = await this.jiraRequest(`/rest/agile/1.0/board${boardId}`);
    return result;
  }

  async getSprints(boardIds: Array<String>):Promise<Array<String>> {
    const sprintPromises = boardIds.map((boardId)=>this.jiraRequest(`/rest/agile/1.0/board/${boardId}/sprint`));
    try{
      const sprints: any[] = await Promise.all(sprintPromises);
      return sprints;
    }catch(e:any){
      console.log("getSprints error", e.response.statusCode);
      return JSON.parse(e.response.statusCode);
    }
  }

  async getIssues(boardId: string) {
    const result = await this.jiraRequest(`/rest/agile/1.0/board/${boardId}/issue`);
    return result;
  }
}
