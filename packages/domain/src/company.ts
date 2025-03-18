import { z } from 'zod';
import { Entity, type TimestampDTO, type Timestamps } from './base';

// Company domain type definitions
export type CompanyAddressType =
  | 'billing'
  | 'shipping'
  | 'headquarters'
  | 'branch'
  | 'other';

export const companyDomainSchema = z.object({
  domain: z.string(),
  isPrimary: z.boolean().default(false),
  isVerified: z.boolean().default(false),
});

export const companyAddressSchema = z.object({
  id: z.string().uuid(),
  addressName: z.string().optional(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  administrativeArea: z.string().optional(), // state, province, etc.
  locality: z.string().optional(), // city, town, etc.
  postalCode: z.string(),
  countryCode: z.string(), // 3-digit ISO code
  type: z.enum(['billing', 'shipping', 'headquarters', 'branch', 'other']),
  isPrimary: z.boolean().default(false),
});

export const bankAccountSchema = z.object({
  id: z.string().uuid(),
  accountName: z.string(),
  accountHolderName: z.string(),
  iban: z.string().optional(),
  bic: z.string().optional(), // SWIFT code
  bankName: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  currencyCode: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

// Base company schema
export const baseCompanySchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string(),
  countryCode: z.string(), // 3-digit ISO code
  vatId: z.string().optional(),
  industryId: z.string().uuid().optional(),
  ext_vendor_number: z.string().optional(),
});

// Inferred types from schemas
export type CompanyDomain = z.infer<typeof companyDomainSchema>;
export type CompanyAddress = z.infer<typeof companyAddressSchema>;
export type BankAccount = z.infer<typeof bankAccountSchema>;
export type BaseCompany = z.infer<typeof baseCompanySchema>;

// Company DTO type with all properties
export type CompanyDTO = BaseCompany &
  TimestampDTO & {
    id: string;
    addresses?: CompanyAddress[];
    domains?: CompanyDomain[];
    bankAccounts?: BankAccount[];
  };

// Company class
export class Company extends Entity<BaseCompany> {
  private _addresses: CompanyAddress[] = [];
  private _domains: CompanyDomain[] = [];
  private _bankAccounts: BankAccount[] = [];
  private _industryName?: string;

  constructor(props: BaseCompany);
  constructor(
    props: BaseCompany,
    id: string,
    timestamps: Timestamps,
    addresses?: CompanyAddress[],
    domains?: CompanyDomain[],
    bankAccounts?: BankAccount[]
  );
  constructor(
    props: BaseCompany,
    id?: string,
    timestamps?: Timestamps,
    addresses?: CompanyAddress[],
    domains?: CompanyDomain[],
    bankAccounts?: BankAccount[]
  ) {
    // Process ext_vendor_number before creating the entity
    const processedProps = { ...props };
    if (processedProps.ext_vendor_number !== undefined) {
      processedProps.ext_vendor_number = Company.processExtVendorNumber(
        processedProps.ext_vendor_number
      );
    }

    if (id && timestamps) {
      super(processedProps, id, timestamps);
    } else {
      super(processedProps);
    }
    this._addresses = addresses ?? [];
    this._domains = domains ?? [];
    this._bankAccounts = bankAccounts ?? [];
  }

  // Static helper method to process ext_vendor_number
  static processExtVendorNumber(
    value: string | undefined | null
  ): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    // Trim spaces
    let processed = value.trim();

    // Remove leading zeros
    processed = processed.replace(/^0+/, '');

    // Return undefined if empty after processing
    return processed === '' ? undefined : processed;
  }

  // Setter for ext_vendor_number that applies processing rules
  set ext_vendor_number(value: string | undefined | null) {
    this.props.ext_vendor_number = Company.processExtVendorNumber(value);
  }

  // Getter for ext_vendor_number
  get ext_vendor_number(): string | undefined {
    return this.props.ext_vendor_number;
  }

  // Getters and setters
  get addresses(): CompanyAddress[] {
    return this._addresses;
  }

  get domains(): CompanyDomain[] {
    return this._domains;
  }

  get bankAccounts(): BankAccount[] {
    return this._bankAccounts;
  }

  get industryName(): string | undefined {
    return this._industryName;
  }

  set industryName(name: string | undefined) {
    this._industryName = name;
  }

  // Methods for managing addresses
  addAddress(address: CompanyAddress): void {
    if (address.isPrimary) {
      // Set all other addresses of same type to non-primary
      this._addresses = this._addresses.map((addr) => {
        if (addr.type === address.type) {
          return { ...addr, isPrimary: false };
        }
        return addr;
      });
    }
    this._addresses.push(address);
  }

  updateAddress(id: string, address: Partial<CompanyAddress>): boolean {
    const index = this._addresses.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const updatedAddress = { ...this._addresses[index], ...address };

    // Handle primary flag logic
    if (updatedAddress.isPrimary) {
      this._addresses = this._addresses.map((addr) => {
        if (addr.id !== id && addr.type === updatedAddress.type) {
          return { ...addr, isPrimary: false };
        }
        return addr;
      });
    }

    this._addresses[index] = updatedAddress as CompanyAddress;
    return true;
  }

  removeAddress(id: string): boolean {
    const initialLength = this._addresses.length;
    this._addresses = this._addresses.filter((a) => a.id !== id);
    return initialLength !== this._addresses.length;
  }

  // Methods for managing domains
  addDomain(domain: CompanyDomain): void {
    if (domain.isPrimary) {
      // Set all other domains to non-primary
      this._domains = this._domains.map((d) => ({ ...d, isPrimary: false }));
    }
    this._domains.push(domain);
  }

  updateDomain(oldDomain: string, domain: Partial<CompanyDomain>): boolean {
    const index = this._domains.findIndex((d) => d.domain === oldDomain);
    if (index === -1) return false;

    const updatedDomain = { ...this._domains[index], ...domain };

    // Handle primary flag logic
    if (updatedDomain.isPrimary) {
      this._domains = this._domains.map((d) => {
        if (d.domain !== oldDomain) {
          return { ...d, isPrimary: false };
        }
        return d;
      });
    }

    this._domains[index] = updatedDomain as CompanyDomain;
    return true;
  }

  removeDomain(domain: string): boolean {
    const initialLength = this._domains.length;
    this._domains = this._domains.filter((d) => d.domain !== domain);
    return initialLength !== this._domains.length;
  }

  // Methods for managing bank accounts
  addBankAccount(account: BankAccount): void {
    if (account.isPrimary) {
      // Set all other bank accounts to non-primary
      this._bankAccounts = this._bankAccounts.map((a) => ({
        ...a,
        isPrimary: false,
      }));
    }
    this._bankAccounts.push(account);
  }

  updateBankAccount(id: string, account: Partial<BankAccount>): boolean {
    const index = this._bankAccounts.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const updatedAccount = { ...this._bankAccounts[index], ...account };

    // Handle primary flag logic
    if (updatedAccount.isPrimary) {
      this._bankAccounts = this._bankAccounts.map((a) => {
        if (a.id !== id) {
          return { ...a, isPrimary: false };
        }
        return a;
      });
    }

    this._bankAccounts[index] = updatedAccount as BankAccount;
    return true;
  }

  removeBankAccount(id: string): boolean {
    const initialLength = this._bankAccounts.length;
    this._bankAccounts = this._bankAccounts.filter((a) => a.id !== id);
    return initialLength !== this._bankAccounts.length;
  }

  // Convert to JSON for API responses
  toJSON(): CompanyDTO {
    return {
      ...super.toJSON(),
      addresses: this._addresses,
      domains: this._domains,
      bankAccounts: this._bankAccounts,
    };
  }
}
