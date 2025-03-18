import { AccountClient } from "postmark";
import { Postbox } from "@taxel/domain/src/postbox.ts";

/**
 * Ths client should only be used for global actions like creating a server. For accessing data, like specific emails, use the PostMarkClient
 */
export class PostMarkAccountClient {
  private client: AccountClient;
  private apiUrl: string;
  constructor(postmarkApiKey: string, apiUrl: string) {
    this.client = new AccountClient(postmarkApiKey);
    this.apiUrl = apiUrl;
  }

  async createServer(postbox: Postbox): Promise<Postbox> {
    const server = await this.client.createServer({
      Name: postbox.id,
      InboundHookUrl: this.getInboundWebhookUrl(),
    });

    const data = postbox.toJSON();

    return new Postbox({
      ...data,
      postmarkServerId: server.ID,
      postmarkInboundEmail: server.InboundAddress,
    }, postbox.id, postbox.getTimestamps());
  }

  private getInboundWebhookUrl() {
    return `${this.apiUrl}/email/inbound`;
  }
}