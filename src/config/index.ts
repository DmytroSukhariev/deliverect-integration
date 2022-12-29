import zod from 'zod';
import * as process from 'process'

const stringNumber = () => zod
  .string()
  .refine((val) => val === undefined || val === null ? true : !isNaN(Number(val)))
  .transform(val => val === undefined || val === null ? val : Number(val))

const configSchema = zod.object({
  APP: zod.object({
    PORT: stringNumber(),
  }),
  MOCK_DELIVERECT_SERVER: zod.object({
    PORT: stringNumber().optional(),
  }),
  DB: zod.object({
    CONNECTION_URL: zod.string(),
  }),
  DELIVERECT: zod.object({
    API_HOST: zod.string(),
    CLIENT: zod.object({
      ID: zod.string(),
      SECRET: zod.string(),
    }),
  }),
});

export const CONFIG = configSchema.parse({
  APP: {
    PORT: process.env.APP_PORT,
  },
  MOCK_DELIVERECT_SERVER: {
    PORT: process.env.MOCK_DELIVERECT_SERVER_PORT
  },
  DB: {
    CONNECTION_URL: process.env.DB_CONNECTION_URL,
  },
  DELIVERECT: {
    API_HOST: process.env.DELIVERECT_API_HOST,
    CLIENT: {
      ID: process.env.DELIVERECT_CLIENT_ID,
      SECRET: process.env.DELIVERECT_CLIENT_SECRET,
    },
  },
});