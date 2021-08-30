import got from 'got';

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
        'Authentication': `TODO`
      }
    })
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
