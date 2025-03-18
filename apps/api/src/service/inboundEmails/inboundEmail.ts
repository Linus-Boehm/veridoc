import { NotFoundError } from '@taxel/domain/src/errors/not-found';
import type { EmailStatus, InboundEmail } from '@taxel/domain/src/inboundEmail';
import type { AppContext } from '../../domain/context';
import { InboundEmailRepository } from '../../repository/inboundEmail';
import { getStorageResourceForKey } from '../documents/create_document';

export class InboundEmailService {
  private readonly inboundEmailRepository: InboundEmailRepository;

  constructor() {
    this.inboundEmailRepository = new InboundEmailRepository();
  }

  async findAll(
    ctx: AppContext,
    includeArchived = false
  ): Promise<InboundEmail[]> {
    const { organization } = ctx;

    return this.inboundEmailRepository.list({
      organizationId: organization.id,
      includeArchived,
    });
  }

  async findById(ctx: AppContext, emailId: string): Promise<InboundEmail> {
    const { organization } = ctx;

    const email = await this.inboundEmailRepository.findById(emailId, {
      organizationId: organization.id,
    });

    if (!email) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Set storage resources for all documents
    const documents = email.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    return email;
  }

  async updateStatus(
    ctx: AppContext,
    emailId: string,
    status: EmailStatus
  ): Promise<InboundEmail> {
    const { organization } = ctx;

    const updatedEmail = await this.inboundEmailRepository.updateStatus(
      emailId,
      status,
      organization.id
    );

    if (!updatedEmail) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Set storage resources for all documents
    const documents = updatedEmail.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    return updatedEmail;
  }

  async updateStatusBasedOnDocuments(
    ctx: AppContext,
    emailId: string
  ): Promise<InboundEmail>;
  async updateStatusBasedOnDocuments(
    organizationId: string,
    emailId: string
  ): Promise<InboundEmail>;
  async updateStatusBasedOnDocuments(
    ctxOrOrgId: AppContext | string,
    emailId: string
  ): Promise<InboundEmail> {
    let organizationId: string;

    if (typeof ctxOrOrgId === 'string') {
      organizationId = ctxOrOrgId;
    } else {
      organizationId = ctxOrOrgId.organization.id;
    }

    // First get the email
    const email = await this.inboundEmailRepository.findById(emailId, {
      organizationId,
    });

    if (!email) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Set storage resources for all documents
    const documents = email.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    // Update the status based on document processing status
    email.updateStatusBasedOnDocuments();

    // Save the updated status
    const updatedEmail = await this.inboundEmailRepository.updateStatus(
      emailId,
      email.getStatus(),
      organizationId
    );

    if (!updatedEmail) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    return updatedEmail;
  }

  async archive(ctx: AppContext, emailId: string): Promise<InboundEmail> {
    const { organization, user } = ctx;

    const archivedEmail = await this.inboundEmailRepository.archive(
      emailId,
      organization.id,
      user.id
    );

    if (!archivedEmail) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Update the status to archived
    await this.inboundEmailRepository.updateStatus(
      emailId,
      'archived',
      organization.id
    );

    // Set storage resources for all documents
    const documents = archivedEmail.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    return archivedEmail;
  }
}
