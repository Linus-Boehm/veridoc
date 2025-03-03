import { z } from "zod";


export const timestampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const entitySchema = z.object({
  id: z.string().uuid(),
  ...timestampsSchema.shape,
});

export type BaseEntity = z.infer<typeof entitySchema>;

export type Timestamps = z.infer<typeof timestampsSchema>;