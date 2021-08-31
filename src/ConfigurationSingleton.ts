import * as Joi from "joi";
import dotenv from 'dotenv';

dotenv.config();


export const configurationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  port: Joi.number(),
  jiraUser: Joi.string().required(),
  jiraToken: Joi.string().required(),
  jiraHost: Joi.string().required(),
});

//TODO: find a way to avoid repetitive type (validating at compile time) + schema (validating at execution time)
type Configuration = {
  NODE_ENV: string,
  port: number,
  jiraUser: string,
  jiraToken: string,
  jiraHost: string,
}

const validationResult = configurationSchema.validate({
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  jiraUser: process.env.JIRA_USER,
  jiraToken: process.env.JIRA_TOKEN,
  jiraHost: process.env.JIRA_HOST,
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
