export type JiraApiReturn<T> = {
  isLast: boolean,
  maxResults: number,
  startAt: number,
  values: T[],
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

export type JiraIssues = {
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