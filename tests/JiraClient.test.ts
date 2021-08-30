import dotenv from 'dotenv';
dotenv.config();

import JiraClient from "../src/JiraClient";

const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const JIRA_HOST = process.env.JIRA_HOST;

if (!JIRA_USER) throw new Error("missing JIRA_USER env");
if (!JIRA_TOKEN) throw new Error("missing JIRA_TOKEN env");
if (!JIRA_HOST) throw new Error("missing JIRA_HOST env");

describe("JiraClient", () => {
  it('should fail cleanly when auth is invalid', async () => {
    const jc = new JiraClient(JIRA_HOST, "invalid", "invalid");

    //TODO: define how we handle jira API errors
    expect(jc.getBoards()).rejects.toThrowError("Response code 401 (Unauthorized)");
  });

  it('should get boards', async () => {
    const jc = new JiraClient(JIRA_HOST, JIRA_USER, JIRA_TOKEN);


    const boardSchema = {
      id: expect.any(Number),
    };

    const boards = await jc.getBoards();
    expect(boards).toContain(boardSchema);
  });
})

