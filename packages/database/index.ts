import 'server-only';

import { keys } from './keys';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

export const database = drizzle({ connection: keys().DATABASE_URL, schema });
