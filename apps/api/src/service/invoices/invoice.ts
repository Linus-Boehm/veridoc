import type { Invoice } from '@taxel/domain/src/invoice';
import type { AppContext } from '../../domain/context';
import { InvoiceRepository } from '../../repository/invoice';
import { NotFoundError } from '@taxel/domain/src/errors/not-found';
import { getStorageResourceForKey } from '../documents/create_document';

export class InvoiceService {
  private readonly invoiceRepository: InvoiceRepository;
  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async create(ctx: AppContext, invoice: Invoice): Promise<Invoice> {
    const { organization, user } = ctx;

    const newInvoice = await this.invoiceRepository.create(invoice);

    return newInvoice;
  }

  async findAll(ctx: AppContext): Promise<Invoice[]> {
    const { organization } = ctx;

    return this.invoiceRepository.list({
      organizationId: organization.id,
    });
  }

  async findById(ctx: AppContext, invoiceId: string): Promise<Invoice> {
    const { organization } = ctx;

    const invoice = await this.invoiceRepository.findById(invoiceId, {
      organizationId: organization.id,
    });
    if (!invoice) {
      throw new NotFoundError(`Invoice with id ${invoiceId} not found`);
    }
    if (invoice.document) {
      const storageResource = await getStorageResourceForKey(
        invoice.document.getStoragePath()
      );
      invoice.document.setStorageResource(storageResource);
    }

    return invoice;
  }
}


