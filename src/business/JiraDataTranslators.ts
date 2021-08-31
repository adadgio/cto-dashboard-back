import { Issue, Sprint } from "@cto-dashboard-model/cto-dashboard-model";
import { JiraIssues, JiraSprint } from '../../types/Jira';

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

export const jiraIssuesToIssues = (jiraIssues: JiraIssues[])=>{
  const issues: Issue[] = jiraIssues.map(issue=>{
    return {
      id: issue.id,
      boardId:issue.fields.sprint?.originBoardId || null,
      name:issue.fields.summary,
      status:issue.fields.status.name,
      type:issue.fields.type,
    }
  })
  return issues;
}