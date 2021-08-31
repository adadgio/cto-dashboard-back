import conf from '../src/ConfigurationSingleton';

import JiraClient from "../src/JiraClient";

describe("JiraClient", () => {
  it('should fail cleanly when auth is invalid', async () => {
    const jc = new JiraClient(conf.jiraHost, "invalid", "invalid");

    //TODO: define how we handle jira API errors
    expect(jc.getBoards()).rejects.toThrowError("Response code 401 (Unauthorized)");
  });

  it('should get boards', async () => {
    const jc = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);


    const boardSchema = {
      id: expect.any(Number),
    };

    const boards = await jc.getBoards();
    expect(boards).toContain(boardSchema);
  });

  it('should get sprints', async () => {
    const jc = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);


    const sprintSchema = {
      id: expect.any(Number),
      name: expect.any(String),
      boardId: expect.any(Number),
    };

    const sprints = await jc.getSprints([1]);
    expect(sprints).toEqual(
      expect.arrayContaining([sprintSchema])
    )
  });
})

