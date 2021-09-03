import * as Joi from "joi";
import dotenv from 'dotenv';

dotenv.config();


export const configurationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  port: Joi.number(),
  jiraUser: Joi.string().required(),
  jiraToken: Joi.string().required(),
  jiraHost: Joi.string().required(),
  neo4jHost: Joi.string().required(),
  neo4jUsername: Joi.string().required(),
  neo4jPassword: Joi.string().required(),
  neo4jDatabase: Joi.string().required(),
  ADMIN_NAME: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  TOKEN_KEY: Joi.string().required(),
});

//TODO: find a way to avoid repetitive type (validating at compile time) + schema (validating at execution time)
type Configuration = {
  NODE_ENV: string,
  port: number,
  jiraUser: string,
  jiraToken: string,
  jiraHost: string,
  neo4jHost: string,
  neo4jUsername: string,
  neo4jPassword: string,
  neo4jDatabase: string,
  ADMIN_NAME: string,
  ADMIN_PASSWORD: string,
  TOKEN_KEY: string,
}

const validationResult = configurationSchema.validate({
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  jiraUser: process.env.JIRA_USER,
  jiraToken: process.env.JIRA_TOKEN,
  jiraHost: process.env.JIRA_HOST,
  neo4jHost: process.env.NEO4J_HOST,
  neo4jUsername: process.env.NEO4J_USERNAME,
  neo4jPassword: process.env.NEO4J_PASSWORD,
  neo4jDatabase: process.env.NEO4J_DATABASE,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  TOKEN_KEY: process.env.TOKEN_KEY,
});

if (validationResult.error) {
  throw new Error(validationResult.error.message);
}

if (validationResult.warning) {
  console.warn("configuration:", validationResult.warning);
}

const configurationSingleton: Configuration = validationResult.value;

console.info("app is running on env", configurationSingleton.NODE_ENV);


export default configurationSingleton;
