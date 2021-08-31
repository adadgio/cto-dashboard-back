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
