import { Hono } from 'hono';
import clerk from './clerk';

const app = new Hono().route('/clerk', clerk);

export default app;
