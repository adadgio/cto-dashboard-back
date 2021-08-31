import * as translators from "../../src/business/JiraDataTranslators";
import {JiraSprint} from '../../types/Jira';

describe("JiraDataTranslators", () => {
  it('should correctly translate data', async () => {
    const fakeJiraSprints: JiraSprint[] = [
      { 
        endDate: "str",
        startDate: "string",
        id: 1,
        name: "string",
        originBoardId: 1,
        self: "string",
        state: "active" 
      },
      { 
        id: 2,
        name: "string",
        originBoardId: 1,
        self: "string",
        state: "future" 
      }
    ];

    const sprints = translators.jiraSprintsToSprints(fakeJiraSprints);

    expect(sprints).toEqual(
      expect.arrayContaining([
        { id: 1, name: "string", boardId: 1},
        { id: 2, name: "string", boardId: 1},
      ])
    );
  });
})
