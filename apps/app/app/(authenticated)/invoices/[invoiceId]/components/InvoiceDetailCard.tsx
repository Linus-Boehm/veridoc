import { InvoiceStatus } from '@repo/design-system/components/domains/invoice/InvoiceStatus';
import { CreditorBadge } from '@repo/design-system/components/ui/Badge/CreditorBadge';
import { EmailBadge } from '@repo/design-system/components/ui/Badge/EmailBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Label } from '@repo/design-system/components/ui/label';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { formatDate } from '@repo/design-system/lib/utils';
import type { InvoiceDTO } from '@taxel/domain/src/invoice';
import { useInboundEmail } from '@taxel/queries/src/inboundEmails';
import type { FC } from 'react';

export interface InvoiceDetailCardProps {
  invoice?: InvoiceDTO;
  status: 'pending' | 'success' | 'error';
}

export const InvoiceDetailCard: FC<InvoiceDetailCardProps> = ({
  invoice,
  status,
}) => {
  const { data: email, isPending: isEmailPending } = useInboundEmail(
    invoice?.document?.emailId ?? '',
    false,
    {
      enabled: !!invoice?.document?.emailId,
    }
  );
  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rechnungsdetails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechnungsdetails</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="invoice-badge">Rechnungsnummer</Label>
            <span className="text-gray-500 text-sm">
              {invoice?.invoiceNumber?.value ?? '-'}
            </span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="invoice-badge">Status</Label>
            <div>
              <InvoiceStatus status={'in_approval'} />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="invoice-badge">Rechnungsdatum</Label>
            <span className="text-gray-500 text-sm">
              {formatDate(invoice?.invoiceDate?.value)}
            </span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="invoice-badge">Kreditor</Label>
            <div>
              <CreditorBadge
                creditorId={'1'}
                creditorName={invoice?.matchedVendorName?.value ?? ''}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="invoice-total">Gesamtbetrag</Label>
            <span id="invoice-total" className="text-gray-500 text-sm">
              {invoice?.invoiceTotal?.currency.amount
                ? new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: invoice.invoiceTotal.currency.currencyCode,
                  }).format(invoice.invoiceTotal.currency.amount)
                : '-'}
            </span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="invoice-payment-terms">Zahlungsbedingungen</Label>
            <span id="invoice-payment-terms" className="text-gray-500 text-sm">
              {invoice?.paymentTerm?.value ?? '-'}
            </span>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email-badge">Quelle</Label>
            {invoice?.document?.emailId ? (
              <div>
                <EmailBadge
                  id="email-badge"
                  emailId={invoice?.document?.emailId ?? ''}
                  emailSubject={email?.subject ?? ''}
                  isLoading={isEmailPending}
                />
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Manueller Upload</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
