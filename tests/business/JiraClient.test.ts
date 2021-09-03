import conf from '../../src/ConfigurationSingleton';

import JiraClient from "../../src/business/JiraClient";
import { JiraSprint } from '../../types/Jira';

describe("JiraClient", () => {
  it('should fail cleanly when auth is invalid', async () => {
    const jc = new JiraClient(conf.jiraHost, "invalid", "invalid");

    //TODO: define how we handle jira API errors
    expect(jc.getBoards()).rejects.toThrowError("Response code 401 (Unauthorized)");
  });

  it('should get boards', async () => {
    const jc = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);

    const boards = await jc.getBoards();
    expect(boards[0].id).toBeDefined();
  });

  it('should get sprints', async () => {
    const jc = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);

    const sprintSchema = {
      id: expect.any(Number),
      self: expect.any(String),
      state: expect.any(String),
      name: expect.any(String),
      originBoardId: expect.any(Number)
    };

    const sprints:JiraSprint[] = await jc.getSprintsOfBoard(1);
    expect(sprints).toEqual(
      expect.arrayContaining([sprintSchema])
    )
  });
})

