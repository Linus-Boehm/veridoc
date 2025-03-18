import { baseDTOschema, Entity } from "#base.ts";
import { z } from "zod";

export const createPostboxSchema = z.object({
    name: z.string(),
    organizationId: z.string().uuid(),
});

export type CreatePostbox = z.infer<typeof createPostboxSchema>;

export const postboxSchema = createPostboxSchema.extend({
    postmarkServerId: z.number().nullable(),
    postmarkInboundEmail: z.string().nullable(),
    organizationId: z.string().uuid(),
});

export type PostboxBase = z.infer<typeof postboxSchema>;

export class Postbox extends Entity<PostboxBase> {
  

    toJSON(): PostboxDTO {
        return super.toJSON();
    }
}

export const postBoxDTOschema = postboxSchema.extend(baseDTOschema.shape);

export type PostboxDTO = z.infer<typeof postBoxDTOschema>;
