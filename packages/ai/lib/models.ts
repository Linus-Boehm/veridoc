import "server-only";
import OpenAI from 'openai';
import { keys } from '../keys';


export const openaiClient = new OpenAI({
  apiKey: keys().OPENAI_API_KEY
});

