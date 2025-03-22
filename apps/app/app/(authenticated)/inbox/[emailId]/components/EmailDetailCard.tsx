import { CreditorBadge } from '@repo/design-system/components/ui/Badge/CreditorBadge';
import { EmailStatusBadge } from '@repo/design-system/components/domains/email/EmailStatusBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Label } from '@repo/design-system/components/ui/label';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import type { InboundEmailDTO } from '@taxel/domain/src/inboundEmail';
import type { FC } from 'react';

export interface EmailDetailCardProps {
  email?: InboundEmailDTO | null;
  status: 'pending' | 'success' | 'error';
}

// Helper function to get status color
const getStatusColor = (
  status: string
):
  | 'neutral'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'primary'
  | 'accent_purple'
  | 'accent_pink' => {
  switch (status) {
    case 'processed':
      return 'success';
    case 'partial_processed':
      return 'info';
    case 'failed':
      return 'error';
    case 'archived':
      return 'warning';
    default:
      return 'neutral';
  }
};

// Helper function to get status label
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'processed':
      return 'Verarbeitet';
    case 'partial_processed':
      return 'Teilweise verarbeitet';
    case 'failed':
      return 'Fehlgeschlagen';
    case 'archived':
      return 'Archiviert';
    default:
      return 'Empfangen';
  }
};

export const EmailDetailCard: FC<EmailDetailCardProps> = ({
  email,
  status,
}) => {
  const isLoading = status === 'pending';

  return (
    <Card>
      <CardHeader>
        <CardTitle>E-Mail Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email-status">Status</Label>

            <div>
              <EmailStatusBadge status={email?.status} isLoading={isLoading} />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email-postbox">Postfach</Label>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <span className="text-gray-500 text-sm">
                {email?.postbox?.name || '-'}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email-message-id">Message ID</Label>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <span className="break-all text-gray-500 text-sm">
                {email?.messageId || '-'}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email-kreditor">Kreditor</Label>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              // This is a placeholder - in a real implementation, you would need to
              // fetch the creditor information based on the email
              <CreditorBadge
                creditorId="1"
                creditorName={email?.fromName || ''}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
