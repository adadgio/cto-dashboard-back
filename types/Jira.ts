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
  endDate?: string,
  startDate?: string,
  id: number,
  name: string,
  originBoardId: number,
  self: string,
  state: "active" | "future" | "archived" //todo
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
    sprint:JiraSprint | null,
    summary:string
    status: {
      name:"Todo" | "Done"
    },
    type: "Bug" | "Feature",
  },
}
