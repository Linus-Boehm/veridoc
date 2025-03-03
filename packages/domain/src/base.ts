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

export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;
  protected _isPersisted = false;
  protected timestamps!: Timestamps;

  // Constructor overload signatures
  constructor(props: T);
  constructor(props: T, id: string, timestamps: Timestamps);

  // Implementation
  constructor(props: T, id?: string, timestamps?: Timestamps) {
    this.props = props;

    if (id && timestamps) {
      this._id = id;
      this.timestamps = timestamps;
      this._isPersisted = true;
    } else {
      this._id = uuidv7();
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

  toJSON(): { id: string } & T {
    return {
      id: this._id,
      ...this.props,
    };
  }
}
