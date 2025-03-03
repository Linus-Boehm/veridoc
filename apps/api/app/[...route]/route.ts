import { handle } from 'hono/vercel';
import router from '../../src/api/router';

export const dynamic = 'force-dynamic';

export const GET = handle(router);
export const POST = handle(router);
export const PUT = handle(router);
export const PATCH = handle(router);
export const DELETE = handle(router);
export const OPTIONS = handle(router);