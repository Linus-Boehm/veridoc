import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import type { CompanyDTO } from '@taxel/domain/src/company';
import { Company } from '@taxel/domain/src/company';
import { CompanyService } from '#src/service/companies/company.ts';
import { ensureAuthenticated, getAppContext } from '../middleware/auth';

const app = new Hono()
  .use(ensureAuthenticated)
  // GET /companies - List all companies
  .get('/', async (c) => {
    const ctx = getAppContext(c);

    const service = new CompanyService();
    const companies = await service.findAll(ctx);

    return c.json<CompanyDTO[]>(
      companies.map((company) => company.toJSON()),
      200
    );
  })
  // GET /companies/:companyId - Get company by ID
  .get(
    '/:companyId',
    zValidator(
      'param',
      z.object({
        companyId: z.string().uuid(),
      })
    ),
    async (c) => {
      const ctx = getAppContext(c);
      const service = new CompanyService();
      const { companyId } = c.req.valid('param');

      const company = await service.findById(ctx, companyId);

      return c.json<CompanyDTO>(company.toJSON(), 200);
    }
  )
  // POST /companies - Create a new company
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        name: z.string().min(1),
        countryCode: z.string().length(3),
        vatId: z.string().optional(),
        industryId: z.string().uuid().optional(),
        ext_vendor_number: z.string().optional(),
        addresses: z
          .array(
            z.object({
              addressName: z.string().optional(),
              addressLine1: z.string(),
              addressLine2: z.string().optional(),
              administrativeArea: z.string().optional(),
              locality: z.string().optional(),
              postalCode: z.string(),
              countryCode: z.string().length(3),
              type: z.enum([
                'billing',
                'shipping',
                'headquarters',
                'branch',
                'other',
              ]),
              isPrimary: z.boolean().default(false),
            })
          )
          .optional(),
        domains: z
          .array(
            z.object({
              domain: z.string(),
              isPrimary: z.boolean().default(false),
              isVerified: z.boolean().default(false),
            })
          )
          .optional(),
        bankAccounts: z
          .array(
            z.object({
              accountName: z.string(),
              accountHolderName: z.string(),
              iban: z.string().optional(),
              bic: z.string().optional(),
              bankName: z.string().optional(),
              routingNumber: z.string().optional(),
              accountNumber: z.string().optional(),
              currencyCode: z.string().optional(),
              isPrimary: z.boolean().default(false),
            })
          )
          .optional(),
      })
    ),
    async (c) => {
      const ctx = getAppContext(c);
      const service = new CompanyService();
      const data = c.req.valid('json');

      // Generate UUIDs for related entities
      const processedData = {
        ...data,
        addresses:
          data.addresses?.map((address) => ({
            ...address,
            id: crypto.randomUUID(),
          })) || [],
        bankAccounts:
          data.bankAccounts?.map((account) => ({
            ...account,
            id: crypto.randomUUID(),
          })) || [],
      };

      // Create the company domain object
      const company = new Company({
        organizationId: ctx.organization.id,
        name: processedData.name,
        countryCode: processedData.countryCode,
        vatId: processedData.vatId,
        industryId: processedData.industryId,
        ext_vendor_number: processedData.ext_vendor_number,
      });

      // Add addresses
      for (const address of processedData.addresses) {
        company.addAddress(address);
      }

      // Add domains
      if (processedData.domains) {
        for (const domain of processedData.domains) {
          company.addDomain(domain);
        }
      }

      // Add bank accounts
      if (processedData.bankAccounts) {
        for (const account of processedData.bankAccounts) {
          company.addBankAccount(account);
        }
      }

      const newCompany = await service.create(ctx, company);

      return c.json<CompanyDTO>(newCompany.toJSON(), 201);
    }
  );

export default app;
