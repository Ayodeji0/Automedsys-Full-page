import * as dotenv from 'dotenv';
dotenv.config(); // load .env variables

export const ENV = process.env.ENV || 'qa';

export const ENV_CONFIG = {
  qa: {
    baseURL: process.env.QA_BASE_URL!,
    username: process.env.QA_USERNAME!,
    password: process.env.QA_PASSWORD!,
    practiceId: process.env.QA_PRACTICE_ID!,
  },
  dev: {
    baseURL: process.env.DEV_BASE_URL!,
    username: process.env.DEV_USERNAME!,
    password: process.env.DEV_PASSWORD!,
    practiceId: process.env.DEV_PRACTICE_ID!,
  },
} as const;

export const ACTIVE_CONFIG = ENV_CONFIG[ENV as keyof typeof ENV_CONFIG];
