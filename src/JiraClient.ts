import got from 'got';

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

  private async jiraRequest(path: string) {
    const req = got('https://' + this.jiraHost + path, {
      headers: {
        Authorization: this.authHeader
      }
    })

    //TODO: define how we want to handle errors through the app!
    const body = await req.json();
    return body;
  }

  async getBoards() {
    await this.jiraRequest('/rest/agile/1.0/board');
    //todo mouline data
    //todo type for API response
  }

  async getBoard(boardId: string) {
    await this.jiraRequest(`/rest/agile/1.0/board${boardId}`);
    //todo mouline data
    //todo type for API response
  }

  async getSprints(boardId: string) {
    await this.jiraRequest(`/rest/agile/1.0/board/${boardId}/sprint`);
    //todo mouline data
    //todo type for API response
  }

  async getIssues(boardId: string) {
    await this.jiraRequest(`/rest/agile/1.0/board/${boardId}/issue`);
    //todo mouline data
    //todo type for API response
  }
}
