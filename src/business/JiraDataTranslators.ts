import { Issue, Sprint } from "@cto-dashboard-model/cto-dashboard-model";
import { JiraIssue, JiraSprint } from '../../types/Jira';

export const jiraSprints = (jiraSprints: JiraSprint[]) => {
  const sprints: Sprint[] = jiraSprints.map(sprint => {
    return {
      id: sprint.id,
      name: sprint.name,
      boardId: sprint.originBoardId,
    }
  })

  return sprints;
}

export const jiraIssues = (jiraIssues: JiraIssue[]) => {
  const issues: Issue[] = jiraIssues.map(issue => {
    // Keeping this commented out in case we want to add more data later
    /*
    console.log({
      id: issue.id,
      summary: issue.fields.summary,
      keys: JSON.stringify(Object.keys(issue.fields)),
      status: issue.fields.status.name,
      closedSprints: issue.fields.closedSprints?.length,
      sprint: issue.fields.sprint?.id,
      // Jira allows it's tools to set "custom fields" on entities, and it has an API to query them per context
      maybeAllSprints: (<any>issue.fields).customfield_10020?.length,
    });
    //console.log(issue.fields);
    */

    const allSprintIds = [];

    if (issue.fields.sprint) {
      allSprintIds.push(issue.fields.sprint.id.toString());
    }
    if (issue.fields.closedSprints) {
      allSprintIds.push(...issue.fields.closedSprints.map(s => s.id.toString()));
    }

    return {
      id: issue.id,
      name:issue.fields.summary,
      status:issue.fields.status.name,
      type:issue.fields.issuetype.name,
      sprintId: issue.fields.sprint?.id.toString() || null,
      projectId:issue.fields.project.id.toString(),
      allSprintIds: allSprintIds,
    }
  })
  return issues;
}
