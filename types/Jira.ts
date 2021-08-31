export type JiraApiReturn<T> = {
  isLast: boolean,
  maxResults: number,
  startAt: number,
  values: T[]
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
