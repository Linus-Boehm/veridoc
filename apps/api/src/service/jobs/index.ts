import {  documentActionsExtract } from './document';
import { inboundEmail } from './webhooks';

export const functions = [
  inboundEmail,
  documentActionsExtract
];
