import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';

const isEntity = (v: Entity<unknown>): v is Entity<unknown> => {
  return v instanceof Entity;
};

export const timestampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().nullable(),
});

export type Timestamps = z.infer<typeof timestampsSchema>;

export const timestampDTOSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().nullable(),
});

export type TimestampDTO = z.infer<typeof timestampDTOSchema>;

export const baseDTOschema = timestampDTOSchema.extend({
  id: z.string().uuid(),
});

export type BaseDTO = z.infer<typeof baseDTOschema>;

export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;
  protected timestamps: Timestamps;

  // Constructor overload signatures
  constructor(props: T);
  constructor(props: T, id: string, timestamps: Timestamps);

  // Implementation
  constructor(props: T, id?: string, timestamps?: Timestamps) {
    this.props = props;

    if (id && timestamps) {
      this._id = id;
      this.timestamps = timestamps;
    } else {
      this._id = uuidv7();
      this.timestamps = {
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: null,
      };
    }
  }

  // Entities are compared based on their referential
  // equality.
  equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id === object._id;
  }

  get id() {
    return this._id;
  }

  getTimestampsJSON() {
    return {
      createdAt: this.timestamps?.createdAt.toISOString(),
      updatedAt: this.timestamps?.updatedAt.toISOString(),
      archivedAt: this.timestamps?.archivedAt?.toISOString() ?? null,
    };
  }

  getTimestamps() {
    return this.timestamps;
  }

  toJSON(): { id: string } & T & TimestampDTO {
    return {
      id: this._id,
      ...this.props,
      ...this.getTimestampsJSON(),
    };
  }
}
