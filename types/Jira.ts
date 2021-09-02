export interface JiraApiReturn {
  isLast: boolean,
  maxResults: number,
  startAt: number,
}

export interface JiraApiReturnValues<T> extends JiraApiReturn {
  values: T[]
}

export interface JiraApiReturnIssues<T> extends JiraApiReturn {
  issues: T[]
}

export type JiraSprint = {
  id: number,
  name: string,
  originBoardId: number,
  self: string,
  startDate?: string,
  endDate?: string,
  completeDate?: string,
  goal: string,
  state: "active" | "future" | "closed" //todo check other types
}

export type JiraBoard = {
  id: number,
  location: {
      avatarURI: string,
      displayName: string,
      name: string,
      projectId: number,
      projectKey: string,
      projectName: string,
      projectTypeKey: string
  },
  name: string,
  self: string
  type: "simple" | "kanban" //TODO check other types
}

export type JiraIssue = {
  id: number,
  fields:{
    created: string,
    updated: string,
    duedate?: string,
    summary: string,
    sprint:JiraSprint | null,

    //TODO: status and issuetype are actually customizable entities with an id and everything,
    //so we might want to handle them as such too?
    status: {
      name: string,
      id: string,
    },
    resolution: { name: string, id: string },
    project: {
      name: string,
      id: number
    },
    issuetype: {
      name: string,
      id: string
    },
    closedSprints: JiraSprint[],
    labels: string[],
    priority: {
      name: string,
      id: string,
    },
    subtasks: JiraIssue[],
  },
}
