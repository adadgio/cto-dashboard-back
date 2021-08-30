import express from 'express';

import conf from './Configuration';
import JiraClient from './JiraClient';
import authRoutesFactory from './routes/auth';
import apiRoutesFactory from './routes/api';

const jiraClient = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);
const authService = { TODO: true };

export const app = express();
const authRouter = authRoutesFactory(authService);
const apiRouter = apiRoutesFactory(jiraClient);

app.use(authRouter);
app.use(apiRouter);

