import * as Joi from "joi";
import dotenv from 'dotenv';

dotenv.config();


export const configurationSchema = Joi.object({
  port: Joi.number().default(3000),
  jiraUser: Joi.string().required(),
  jiraToken: Joi.string().required(),
  jiraHost: Joi.string().required(),
});

//TODO: find a way to avoid repetitive type (validating at compile time) + schema (validating at execution time)
type Configuration = {
  port: number,
  jiraUser: string,
  jiraToken: string,
  jiraHost: string,
}

const validationResult = configurationSchema.validate({
  port: process.env.PORT,
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
export default configurationSingleton;
