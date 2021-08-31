type JiraBoard = {
  id: string;
  self: string; // uri du service
  name: string;
  type: string;
  location: {
    projectId: number;
    userId: number;
    userAccountId: string;
    displayName: string;
    projectName: string;
    projectKey: string;
    projectTypeKey: string;
    name: string;
  };
};
