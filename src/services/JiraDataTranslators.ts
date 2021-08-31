import { Sprint } from "@cto-dashboard-model/cto-dashboard-model";
import { JiraSprint } from '../types/Jira';

export const jiraSprintsToSprints = (jiraSprints: JiraSprint[]) => {
  const sprints: Sprint[] = jiraSprints.map(sprint => {
    return {
      id: sprint.id,
      name: sprint.name,
      boardId: sprint.originBoardId,
    }
  })

  return sprints;
}
