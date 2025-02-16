import { analytics } from '@repo/analytics/posthog/server';
import type { WebhookResponseHandler } from './types';
import { DEFAULT_WEBHOOK_RESPONSE } from './utils';
import type {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserJSON,
} from '@repo/auth/server';
import { removeUser, upsertUser } from '@/src/repository/users';
import { removeOrganization, removeOrganizationMembership, upsertOrganization, upsertOrganizationMembership } from '@/src/repository/organization';

export const handleUserCreated: WebhookResponseHandler<UserJSON> = async (
  data
) => {
  analytics.identify({
    distinctId: data.id,
    properties: {
      email: data.email_addresses.at(0)?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: new Date(data.created_at),
      avatar: data.image_url,
      phoneNumber: data.phone_numbers.at(0)?.phone_number,
    },
  });

  analytics.capture({
    event: 'User Created',
    distinctId: data.id,
  });

  await upsertUser(data);

  return DEFAULT_WEBHOOK_RESPONSE;
};

export const handleUserUpdated: WebhookResponseHandler<UserJSON> = async (
  data
) => {
  analytics.identify({
    distinctId: data.id,
    properties: {
      email: data.email_addresses.at(0)?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: new Date(data.created_at),
      avatar: data.image_url,
      phoneNumber: data.phone_numbers.at(0)?.phone_number,
    },
  });

  analytics.capture({
    event: 'User Updated',
    distinctId: data.id,
  });

  await upsertUser(data);

  return DEFAULT_WEBHOOK_RESPONSE;
};

export const handleUserDeleted: WebhookResponseHandler<
  DeletedObjectJSON
> = async (data) => {
  if (data.id) {
    analytics.identify({
      distinctId: data.id,
      properties: {
        deleted: new Date(),
      },
    });

    analytics.capture({
      event: 'User Deleted',
      distinctId: data.id,
    });

    await removeUser(data.id);
  }

  return DEFAULT_WEBHOOK_RESPONSE;
};

export const handleOrganizationCreated = async (data: OrganizationJSON) => {
  analytics.groupIdentify({
    groupKey: data.id,
    groupType: 'company',
    distinctId: data.created_by,
    properties: {
      name: data.name,
      avatar: data.image_url,
    },
  });

  analytics.capture({
    event: 'Organization Created',
    distinctId: data.created_by || 'unknown',
  });

  await upsertOrganization(data);

  return DEFAULT_WEBHOOK_RESPONSE;
};

export const handleOrganizationUpdated: WebhookResponseHandler<
  OrganizationJSON
> = async (data) => {
  analytics.groupIdentify({
    groupKey: data.id,
    groupType: 'company',
    distinctId: data.created_by,
    properties: {
      name: data.name,
      avatar: data.image_url,
    },
  });

  analytics.capture({
    event: 'Organization Updated',
    distinctId: data.created_by || 'unknown',
  });

  await upsertOrganization(data);

  return DEFAULT_WEBHOOK_RESPONSE;
};

export const handleOrganizationDeleted: WebhookResponseHandler<
  DeletedObjectJSON
> = async (data) => {
  if (!data.id) {
    throw new Error('Organization ID is required');
  }

  analytics.capture({
    event: 'Organization Deleted',
    distinctId: data.id,
  });

  await removeOrganization(data.id);

  return DEFAULT_WEBHOOK_RESPONSE;
};

export const handleOrganizationMembershipCreated: WebhookResponseHandler<
  OrganizationMembershipJSON
> = async (data) => {
  analytics.groupIdentify({
    groupKey: data.organization.id,
    groupType: 'company',
    distinctId: data.public_user_data.user_id,
  });

  analytics.capture({
    event: 'Organization Member Created',
    distinctId: data.public_user_data.user_id,
  });

  await upsertOrganizationMembership(data);

  return DEFAULT_WEBHOOK_RESPONSE;
};

export const handleOrganizationMembershipDeleted: WebhookResponseHandler<
  OrganizationMembershipJSON
> = async (data) => {
  analytics.capture({
    event: 'Organization Member Deleted',
    distinctId: data.public_user_data.user_id,
  });

  await removeOrganizationMembership(data);

  return DEFAULT_WEBHOOK_RESPONSE;
};