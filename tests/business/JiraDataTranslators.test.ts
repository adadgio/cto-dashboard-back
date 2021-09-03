import * as translators from "../../src/business/JiraDataTranslators";
import {JiraSprint} from '../../types/Jira';

describe("JiraDataTranslators", () => {
  it('should correctly translate data', async () => {
  //   id: number,
  // name: string,
  // originBoardId: number,
  // self: string,
  // startDate?: string,
  // endDate?: string,
  // completeDate?: string,
  // goal: string,
  // state: "active" | "future" | "closed"
    const fakeJiraSprints: JiraSprint[] = [
      { 
        endDate: "str",
        startDate: "string",
        completeDate:"str2",
        id: 1,
        name: "string",
        originBoardId: 1,
        self: "string",
        state: "active" ,
        goal: "test",
      },
      { 
        id: 2,
        name: "string",
        originBoardId: 1,
        self: "string",
        state: "future",
        goal: "test"
      }
    ];

    const sprints = translators.jiraSprints(fakeJiraSprints);

    expect(sprints).toEqual(
      expect.arrayContaining([
        { id: 1, name: "string", boardId: 1, startDate: "string", endDate:"str", completeDate:"str2"},
        { id: 2, name: "string", boardId: 1},
      ])
    );
  });
})
