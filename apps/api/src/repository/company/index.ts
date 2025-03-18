import { database } from '@repo/database';
import { type SQL, and, eq, gt } from '@repo/database/client';
import {
  addresses as addressesTable,
  bankAccounts,
  companies,
  companyAddresses,
  companyDomains,
} from '@repo/database/schema';
import type { Company } from '@taxel/domain/src/company';
import type { Pagination } from '../base';
import { mapCompanyToDb, mapCompanyToDomain } from './type-mapper.ts';

export interface FindCompanyByIdOptions {
  organizationId?: string;
}

export interface ListCompaniesOptions {
  organizationId?: string;
  pagination?: Pagination;
}

export class CompanyRepository {
  async create(newCompany: Company): Promise<Company> {
    const dbCompany = mapCompanyToDb(newCompany);
    // Extract organizational ID before inserting
    const organizationId = dbCompany.organizationId;

    const [insertedCompany] = await database
      .insert(companies)
      .values(dbCompany)
      .returning();

    // Create company addresses if any
    if (newCompany.addresses.length > 0) {
      // Create addresses first
      for (const address of newCompany.addresses) {
        // First insert the address
        const [insertedAddress] = await database
          .insert(addressesTable)
          .values({
            id: address.id,
            organizationId: organizationId,
            addressName: address.addressName || null,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || null,
            administrativeArea: address.administrativeArea || null,
            locality: address.locality || null,
            postalCode: address.postalCode,
            countryCode: address.countryCode,
          })
          .returning();

        // Then create the company-address relation
        await database.insert(companyAddresses).values({
          companyId: insertedCompany.id,
          addressId: insertedAddress.id,
          organizationId: organizationId,
          type: address.type,
          isPrimary: address.isPrimary,
        });
      }
    }

    // Create company domains if any
    if (newCompany.domains.length > 0) {
      const domainValues = newCompany.domains.map((domain) => ({
        companyId: insertedCompany.id,
        organizationId: organizationId,
        domain: domain.domain,
        isPrimary: domain.isPrimary,
        isVerified: domain.isVerified,
      }));

      await database.insert(companyDomains).values(domainValues);
    }

    // Create bank accounts if any
    if (newCompany.bankAccounts.length > 0) {
      const bankAccountValues = newCompany.bankAccounts.map((account) => ({
        companyId: insertedCompany.id,
        organizationId: organizationId,
        accountName: account.accountName,
        accountHolderName: account.accountHolderName,
        iban: account.iban,
        bic: account.bic,
        bankName: account.bankName,
        routingNumber: account.routingNumber,
        accountNumber: account.accountNumber,
        currencyCode: account.currencyCode,
        isPrimary: account.isPrimary,
      }));

      await database.insert(bankAccounts).values(bankAccountValues);
    }

    return this.findById(insertedCompany.id, {
      organizationId: organizationId,
    }) as Promise<Company>;
  }

  async findById(
    id: string,
    opts: FindCompanyByIdOptions = {}
  ): Promise<Company | null> {
    const where: SQL[] = [eq(companies.id, id)];
    if (opts.organizationId) {
      where.push(eq(companies.organizationId, opts.organizationId));
    }

    const company = await database.query.companies.findFirst({
      where: and(...where),
      with: {
        industry: true,
        bankAccounts: true,
        addresses: {
          with: {
            address: true,
          },
        },
        domains: true,
      },
    });

    return company ? mapCompanyToDomain(company) : null;
  }

  async list(opts: ListCompaniesOptions = {}): Promise<Company[]> {
    if (opts.pagination?.limit && opts.pagination.limit > 1000) {
      throw new Error('Limit is too large');
    }

    const where: SQL[] = [];
    if (opts.organizationId) {
      where.push(eq(companies.organizationId, opts.organizationId));
    }

    if (opts.pagination?.idPointer) {
      where.push(gt(companies.id, opts.pagination.idPointer));
    }

    const companyList = await database.query.companies.findMany({
      where: and(...where),
      limit: opts.pagination?.limit ?? 100,
      with: {
        industry: true,
        bankAccounts: true,
        addresses: {
          with: {
            address: true,
          },
        },
        domains: true,
      },
      orderBy: (companies, { desc }) => [desc(companies.id)],
    });

    return companyList.map((company) => mapCompanyToDomain(company));
  }
}
