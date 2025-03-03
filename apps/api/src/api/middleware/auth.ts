import { getUserByClerkId } from '../../repository/users';
import { getAuth } from '@repo/auth/honoMiddleware';
import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';
import { getOrganizationByClerkId } from '../../repository/organization';
import type { Organization, User } from '../../domain/organization';
import type { AppContext } from '../../domain/context';
import { HTTPException } from 'hono/http-exception';

export const ensureAuthenticated = createMiddleware(async (c, next) => {
  const auth = await getAuth(c);
  if (!auth || !auth.userId || !auth.orgId) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  const dbUserPromise = getUserByClerkId(auth.userId);
  const organizationPromise = getOrganizationByClerkId(auth.orgId);
  const [dbUser, organization] = await Promise.all([dbUserPromise, organizationPromise]);
  if (!dbUser || !organization) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  c.set('user', dbUser);
  c.set('organization', organization);
  return next();
});

export const getUser = (c: Context) => {
  return c.get('user') as User | undefined;
};

export const getOrganization = (c: Context) => {
  return c.get('organization') as Organization | undefined;
};


export const getAppContext = (c: Context): AppContext => {
  const user = getUser(c);
  const organization = getOrganization(c);
  if (!user || !organization) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
  return {
    user,
    organization,
  };
};
