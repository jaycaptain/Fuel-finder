import * as zod from 'zod';
import { Env } from './core/Env';

const falsy = zod.coerce.string().transform((value) => value === 'true');

const schema = zod.object({
  NODE_ENV: zod.string().default('development').optional(),
  FUEL_PROVIDER: zod.string(),
  SERVER_PORT: zod.string(),
  SERVER_API_KEY: zod.string().optional().nullable(),
  SYNCER_PORT: zod.string(),
  DB_HOST: zod.string(),
  DB_PORT: zod.string(),
  DB_USER: zod.string(),
  DB_PASS: zod.string(),
  DB_NAME: zod.string(),
  RABBITMQ_HOST: zod.string(),
  RABBITMQ_PORT: zod.string(),
  RABBITMQ_USER: zod.string(),
  RABBITMQ_PASS: zod.string(),
  SYNC_MISSING: falsy.optional(),
  SERVER_BUILD: falsy.optional(),
  IS_DEV_TEST: falsy.optional(),
  SYNC_OFFSET: zod.string().optional(),
  SYNC_LIMIT: zod.string().optional(),
  QUEUE_CONCURRENCY: zod.string().optional(),
  WATCH_INTERVAL: zod.string().optional(),
});

export const env = new Env(schema, {
  NODE_ENV: 'development',
  FUEL_PROVIDER: 'http://localhost:4000/v1/graphql',
  SERVER_PORT: '3002',
  SERVER_API_KEY: 'secret',
  SYNCER_PORT: '3003',
  DB_HOST: 'localhost',
  DB_PORT: '5435',
  DB_USER: 'postgres',
  DB_PASS: 'postgres',
  DB_NAME: 'postgres',
  RABBITMQ_HOST: 'localhost',
  RABBITMQ_PORT: '5672',
  RABBITMQ_USER: 'guest',
  RABBITMQ_PASS: 'guest',
  SERVER_BUILD: false,
  SYNC_MISSING: false,
  IS_DEV_TEST: false,
  SYNC_OFFSET: '10',
  SYNC_LIMIT: '10000',
  QUEUE_CONCURRENCY: '1000',
  WATCH_INTERVAL: '5000',
});
