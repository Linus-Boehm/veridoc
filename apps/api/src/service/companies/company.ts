import type { Company } from '@taxel/domain/src/company';
import { ForbiddenError } from '@taxel/domain/src/errors/forbidden';
import { NotFoundError } from '@taxel/domain/src/errors/not-found';
import type { AppContext } from '../../domain/context';
import { CompanyRepository } from '../../repository/company';

export class CompanyService {
  private readonly companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  async create(ctx: AppContext, company: Company): Promise<Company> {
    const { organization } = ctx;

    // Ensure the company belongs to the organization
    const companyData = company.toJSON();

    // If organization ID doesn't match, throw a ForbiddenError
    if (companyData.organizationId !== organization.id) {
      throw new ForbiddenError(
        `You don't have permission to create a company for organization ID: ${companyData.organizationId}`
      );
    }

    const newCompany = await this.companyRepository.create(company);
    return newCompany;
  }

  async findAll(ctx: AppContext): Promise<Company[]> {
    const { organization } = ctx;

    return this.companyRepository.list({
      organizationId: organization.id,
    });
  }

  async findById(ctx: AppContext, companyId: string): Promise<Company> {
    const { organization } = ctx;

    const company = await this.companyRepository.findById(companyId, {
      organizationId: organization.id,
    });

    if (!company) {
      throw new NotFoundError(`Company with id ${companyId} not found`);
    }

    return company;
  }
}
