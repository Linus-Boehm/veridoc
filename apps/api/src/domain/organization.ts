import { z } from "zod";
import { entitySchema } from "./base";

export const baseOrganizationSchema = z.object({
    name: z.string(),
    clerkId: z.string(),
});

export type BaseOrganization = z.infer<typeof baseOrganizationSchema>;
    
export const organizationSchema = entitySchema.extend(baseOrganizationSchema.shape);

export type Organization = z.infer<typeof organizationSchema>;

export const baseUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

export type BaseUser = z.infer<typeof baseUserSchema>;

export const userSchema = entitySchema.extend(baseUserSchema.shape);

export type User = z.infer<typeof userSchema>;
