import { DocumentBadge } from '@repo/design-system/components/ui/Badge/DocumentBadge';
import { InvoiceBadge } from '@repo/design-system/components/ui/Badge/InvoiceBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import type { InboundEmailDTO } from '@taxel/domain/src/inboundEmail';
import { useInvoices } from '@taxel/queries/src/invoices';
import type { FC } from 'react';

export interface EmailAttachmentsCardProps {
  email?: InboundEmailDTO;
  status: 'pending' | 'success' | 'error';
}

export const EmailAttachmentsCard: FC<EmailAttachmentsCardProps> = ({
  email,
  status,
}) => {
  const isLoading = status === 'pending';

  // Fetch all invoices to find ones related to this email's documents
  const { data: invoices } = useInvoices();

  // Get document IDs from the email
  const documentIds = email?.documents?.map((doc) => doc.id) || [];

  // Find invoices that are related to the documents in this email
  const relatedInvoices =
    invoices?.filter(
      (invoice) => invoice.document && documentIds.includes(invoice.document.id)
    ) || [];

  // Get documents that don't have an invoice
  const documentsWithoutInvoice =
    email?.documents?.filter(
      (doc) =>
        !relatedInvoices.some((invoice) => invoice.document?.id === doc.id)
    ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anhänge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <>
              {/* Display invoices */}
              {relatedInvoices.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Rechnungen</h3>
                  <div className="space-2">
                    {relatedInvoices.map((invoice) => (
                      <InvoiceBadge
                        key={invoice.id}
                        invoiceId={invoice.id}
                        invoiceNumber={invoice.invoiceNumber?.value}
                        fileName={invoice.document?.fileName || ''}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Display documents without invoices */}
              {documentsWithoutInvoice.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Dokumente</h3>
                  <div className="flex flex-wrap gap-1">
                    {documentsWithoutInvoice.map((doc) => (
                      <DocumentBadge
                        key={doc.id}
                        documentId={doc.id}
                        documentName={doc.fileName}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Show message if no attachments */}
              {(!email?.documents || email.documents.length === 0) && (
                <p className="text-muted-foreground text-sm">
                  Keine Anhänge vorhanden
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
