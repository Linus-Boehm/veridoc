import 'server-only';
import { database } from '@repo/database';
import { eq } from '@repo/database/client';
import { users } from '@repo/database/schema';
import type { UserJSON } from '@repo/auth/server';

export const removeUser = async (clerkId: string) => {
  await database.delete(users).where(eq(users.clerkId, clerkId));
};

export const getUserByClerkId = async (clerkId: string) => {
  const user = await database.query.users.findFirst({
    where: (user, { eq }) => eq(user.clerkId, clerkId),
  });
  return user;
};

export const upsertUser = async (data: UserJSON) => {
  const primaryEmail = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id
  );

  if (!primaryEmail?.email_address) {
    throw new Error('Primary email address not found');
  }

  const updateData = {
    clerkId: data.id,
    email: primaryEmail.email_address,
  };

  await database
    .insert(users)
    .values(updateData)
    .onConflictDoUpdate({
      target: [users.clerkId],
      set: updateData,
    });
};