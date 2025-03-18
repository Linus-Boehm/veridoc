import type { Postbox } from '@taxel/domain/src/postbox';
import type { AppContext } from '#src/domain/context.ts';
import { PostboxRepository } from '#src/repository/postbox/index.ts';
import { PostMarkAccountClient } from './PostMarkAccountClient';
/**
 * This service is responsible for managing servers for a taxel tenant
 */
export class PostboxService {
  private client: PostMarkAccountClient;
  private repository: PostboxRepository;

  constructor(postmarkApiKey: string, apiUrl: string) {
    this.client = new PostMarkAccountClient(postmarkApiKey, apiUrl);
    this.repository = new PostboxRepository();
  }

  async createServer(ctx: AppContext, postbox: Postbox) {
    const newPostbox = await this.client.createServer(postbox);
    const createdPostbox = await this.repository.create(newPostbox);
    return createdPostbox;
  }

  async list(ctx: AppContext) {
    return this.repository.listByOrganizationId(ctx.organization.id);
  }
}
