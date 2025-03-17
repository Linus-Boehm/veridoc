import { Hono } from 'hono';
import clerk from './clerk';
import email from './email';

const app = new Hono().route('/clerk', clerk).route('/email', email);

export default app;
