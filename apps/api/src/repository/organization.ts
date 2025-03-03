import 'server-only';

import type { OrganizationJSON, OrganizationMembershipJSON } from '@repo/auth/server';
import { database } from '@repo/database';
import { eq } from '@repo/database/client';
import {
  organizationMemberships,
  organizations,
  users,
} from '@repo/database/schema';
import type { Organization } from '../domain/organization';

export const upsertOrganization = async (data: OrganizationJSON) => {
  const updateData = {
    name: data.name,
    slug: data.slug,
    clerkId: data.id,
  };

  await database
    .insert(organizations)
    .values(updateData)
    .onConflictDoUpdate({
      target: [organizations.clerkId],
      set: updateData,
    });
};

export const removeOrganization = async (clerkId: string) => {
  await database
    .delete(organizations)
    .where(eq(organizations.clerkId, clerkId));
};

export const upsertOrganizationMembership = async (
  data: Array<OrganizationMembershipJSON>
) => {
 const orgId = data[0].organization.id
 const userId = data[0].public_user_data.user_id

 if(!orgId || !userId) {
  throw new Error('Organization or user not set');
 }

 if(data.some(m => m.organization.id !== orgId || m.public_user_data.user_id !== userId)) {
  throw new Error('Organization or user not consistent');
 }



  await database.transaction(async (tx) => {
    let org = await tx
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.clerkId, orgId));
    const user = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId));

    if (!org[0]) {
      const createdOrg = await tx
        .insert(organizations)
        .values({
          clerkId: orgId,
          name: data[0].organization.name,
          slug: data[0].organization.slug,
        })
        .onConflictDoNothing()
        .returning();
      org = createdOrg;
    }

    if (!org[0] || !user[0]) {
      throw new Error('Organization or user not found');
    }

    const updateData = data.map((m) => ({
      organizationId: org[0].id,
      userId: user[0].id,
      clerkId: m.id,
    }));

    await tx
      .insert(organizationMemberships)
      .values(updateData)
      .onConflictDoNothing({
        target: [organizationMemberships.clerkId],
      });
  });
};

export const removeOrganizationMembership = async (
  data: OrganizationMembershipJSON
) => {
  await database
    .delete(organizationMemberships)
    .where(eq(organizationMemberships.clerkId, data.id));
};

export const getOrganizationByClerkId = async (clerkId: string): Promise<Organization | undefined> => {
  const org = await database.query.organizations.findFirst({
    where: (org, { eq }) => eq(org.clerkId, clerkId),
  });
  return org;
};
