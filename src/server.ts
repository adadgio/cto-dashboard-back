import express from 'express';
const cors = require('cors');

import conf from './ConfigurationSingleton';
import JiraClient from './business/JiraClient';
import authRoutesFactory from './routes/auth';
import apiRoutesFactory from './routes/api';
import errorHandlerMiddleware from './middlewares/errorHandler';
import loggerMiddleware from './middlewares/loggerMiddleware';
var bodyParser = require('body-parser')

const jiraClient = new JiraClient(conf.jiraHost, conf.jiraUser, conf.jiraToken);

export const app = express();

// Bodyparser - traite les requêtes.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())

const authRouter = authRoutesFactory();
const apiRouter = apiRoutesFactory(jiraClient);

app.use(loggerMiddleware);
app.use(authRouter);
app.use(apiRouter);

app.use(errorHandlerMiddleware);

