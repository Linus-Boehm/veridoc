import type {
  InsertBankAccount,
  InsertCompany,
  InsertCompanyDomain,
  SelectAddress,
  SelectBankAccount,
  SelectCompany,
  SelectCompanyDomain,
  SelectIndustry,
} from '@repo/database/types';
import { Company } from '@taxel/domain/src/company';
import type {
  BankAccount,
  CompanyAddress,
  CompanyDomain,
} from '@taxel/domain/src/company';

// Define address type as a literal type
type AddressType = 'billing' | 'shipping' | 'headquarters' | 'branch' | 'other';

export type DbCompanyWithRelations = SelectCompany & {
  industry?: SelectIndustry | null;
  addresses?: {
    address: SelectAddress;
    type: AddressType;
    isPrimary: boolean;
  }[];
  domains?: SelectCompanyDomain[];
  bankAccounts?: SelectBankAccount[];
};

export const mapCompanyToDb = (company: Company): InsertCompany => {
  // Get company data in a way that avoids accessing protected props directly
  const data = company.toJSON();

  return {
    id: company.id,
    organizationId: data.organizationId,
    name: data.name,
    countryCode: data.countryCode,
    vatId: data.vatId || null,
    industryId: data.industryId || null,
    ext_vendor_number: data.ext_vendor_number || null,
    createdAt: company.getTimestamps().createdAt,
    updatedAt: company.getTimestamps().updatedAt,
    archivedAt: company.getTimestamps().archivedAt,
    archivedBy: null, // TODO: Handle archivedBy if needed
  };
};

export const mapCompanyDomainToDb = (
  domain: CompanyDomain,
  companyId: string,
  organizationId: string
): InsertCompanyDomain => {
  return {
    id: crypto.randomUUID(),
    companyId,
    organizationId,
    domain: domain.domain,
    isPrimary: domain.isPrimary,
    isVerified: domain.isVerified,
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
    archivedBy: null,
  };
};

export const mapBankAccountToDb = (
  account: BankAccount,
  companyId: string,
  organizationId: string
): InsertBankAccount => {
  return {
    id: account.id,
    companyId,
    organizationId,
    accountName: account.accountName,
    accountHolderName: account.accountHolderName,
    iban: account.iban || null,
    bic: account.bic || null,
    bankName: account.bankName || null,
    routingNumber: account.routingNumber || null,
    accountNumber: account.accountNumber || null,
    currencyCode: account.currencyCode || null,
    isPrimary: account.isPrimary,
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
    archivedBy: null,
  };
};

export const mapDbDomainToDomain = (
  dbDomain: SelectCompanyDomain
): CompanyDomain => {
  return {
    domain: dbDomain.domain,
    isPrimary: dbDomain.isPrimary,
    isVerified: dbDomain.isVerified,
  };
};

export const mapDbAddressToDomain = (
  dbAddress: SelectAddress,
  type: AddressType = 'other',
  isPrimary = false
): CompanyAddress => {
  return {
    id: dbAddress.id,
    addressName: dbAddress.addressName || undefined,
    addressLine1: dbAddress.addressLine1,
    addressLine2: dbAddress.addressLine2 || undefined,
    administrativeArea: dbAddress.administrativeArea || undefined,
    locality: dbAddress.locality || undefined,
    postalCode: dbAddress.postalCode,
    countryCode: dbAddress.countryCode,
    type,
    isPrimary,
  };
};

export const mapDbBankAccountToDomain = (
  dbAccount: SelectBankAccount
): BankAccount => {
  return {
    id: dbAccount.id,
    accountName: dbAccount.accountName,
    accountHolderName: dbAccount.accountHolderName,
    iban: dbAccount.iban || undefined,
    bic: dbAccount.bic || undefined,
    bankName: dbAccount.bankName || undefined,
    routingNumber: dbAccount.routingNumber || undefined,
    accountNumber: dbAccount.accountNumber || undefined,
    currencyCode: dbAccount.currencyCode || undefined,
    isPrimary: dbAccount.isPrimary,
  };
};

export const mapCompanyToDomain = (
  dbCompany: DbCompanyWithRelations
): Company => {
  const timestamps = {
    createdAt: dbCompany.createdAt,
    updatedAt: dbCompany.updatedAt,
    archivedAt: dbCompany.archivedAt,
  };

  const company = new Company(
    {
      organizationId: dbCompany.organizationId,
      name: dbCompany.name,
      countryCode: dbCompany.countryCode,
      vatId: dbCompany.vatId || undefined,
      industryId: dbCompany.industryId || undefined,
      ext_vendor_number: dbCompany.ext_vendor_number || undefined,
    },
    dbCompany.id,
    timestamps
  );

  // Set industry name if present
  if (dbCompany.industry) {
    company.industryName = dbCompany.industry.name;
  }

  // Add addresses if present
  if (dbCompany.addresses && dbCompany.addresses.length > 0) {
    for (const addressRel of dbCompany.addresses) {
      const address: CompanyAddress = {
        id: addressRel.address.id,
        addressName: addressRel.address.addressName || undefined,
        addressLine1: addressRel.address.addressLine1,
        addressLine2: addressRel.address.addressLine2 || undefined,
        administrativeArea: addressRel.address.administrativeArea || undefined,
        locality: addressRel.address.locality || undefined,
        postalCode: addressRel.address.postalCode,
        countryCode: addressRel.address.countryCode,
        type: addressRel.type || 'other',
        isPrimary: addressRel.isPrimary || false,
      };
      company.addAddress(address);
    }
  }

  // Add domains if present
  if (dbCompany.domains && dbCompany.domains.length > 0) {
    for (const domain of dbCompany.domains) {
      company.addDomain(mapDbDomainToDomain(domain));
    }
  }

  // Add bank accounts if present
  if (dbCompany.bankAccounts && dbCompany.bankAccounts.length > 0) {
    for (const account of dbCompany.bankAccounts) {
      company.addBankAccount(mapDbBankAccountToDomain(account));
    }
  }

  return company;
};
