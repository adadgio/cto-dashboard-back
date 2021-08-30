import express from 'express';

import JiraClient from './JiraClient';
import authRoutesFactory from './routes/auth';
import apiRoutesFactory from './routes/api';

//TODO: ConfigService + joi to validate it
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const JIRA_HOST = process.env.JIRA_HOST;

if (!JIRA_USER) throw new Error("missing JIRA_USER env");
if (!JIRA_TOKEN) throw new Error("missing JIRA_TOKEN env");
if (!JIRA_HOST) throw new Error("missing JIRA_HOST env");

const jiraClient = new JiraClient(JIRA_HOST, JIRA_USER, JIRA_TOKEN);
const authService = { TODO: true };

export const app = express();
const authRouter = authRoutesFactory(authService);
const apiRouter = apiRoutesFactory(jiraClient);

app.use(authRouter);
app.use(apiRouter);

