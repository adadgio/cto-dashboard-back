import express from 'express';

import conf from './ConfigurationSingleton';
import JiraClient from './JiraClient';
import authRoutesFactory from './routes/auth';
import apiRoutesFactory from './routes/api';
import errorHandlerMiddleware from './middlewares/errorHandler';
import loggerMiddleware from './middlewares/loggerMiddleware';

const jiraClient = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);
const authService = { TODO: true };

export const app = express();
const authRouter = authRoutesFactory(authService);
const apiRouter = apiRoutesFactory(jiraClient);


app.use(loggerMiddleware);

app.use(authRouter);
app.use(apiRouter);

app.use(errorHandlerMiddleware);

