import { Postbox } from "@taxel/domain/src/postbox";
import type { InsertPostbox, SelectPostbox } from "@repo/database/types";
import { mapTimestampsToDomain, removeTimestamps } from "../type-mappers";

export const mapPostboxToDb = (postbox: Postbox): InsertPostbox => {
    const data = removeTimestamps(postbox);
  return {
    ...data,
  };
};

export const mapPostboxToDomain = (postbox: SelectPostbox): Postbox => {
    const {id, ...data} = postbox;
  return new Postbox(
    {
      name: data.name,
      organizationId: data.organizationId,
      postmarkServerId: data.postmarkServerId,
      postmarkInboundEmail: data.postmarkInboundEmail,
    },
    id,
    mapTimestampsToDomain(postbox)
  );
};
