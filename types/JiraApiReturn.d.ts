type JiraApiReturn<T> = {
    isLast: boolean,
    maxResults: number,
    startAt: number,
    values: T[]
  }