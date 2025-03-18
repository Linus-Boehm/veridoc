import { inboundEmail } from "./webhooks";
import { documentActionsExtract } from "./document";

export const functions = [inboundEmail, documentActionsExtract];