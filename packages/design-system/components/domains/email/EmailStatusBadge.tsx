import { ColorVariants, StatusBadge } from "#components/ui/Badge/StatusBadge.tsx";
import { FC } from "react";
import type { EmailStatus } from '@taxel/domain/src/inboundEmail';

export interface EmailStatusProps {
  status?: EmailStatus;
  isLoading?: boolean;
}

const statusMap: Record<EmailStatus, ColorVariants> = {
  received: 'neutral',
  processed: 'info',
  partial_processed: 'accent_purple',
  failed: 'error',
  archived: 'warning',
};

const statusLabelMap: Record<EmailStatus, string> = {
  received: 'Empfangen',
  processed: 'Verarbeitet',
  partial_processed: 'Teilweise verarbeitet',
  failed: 'Fehlgeschlagen',
  archived: 'Archiviert',
};

export const EmailStatusBadge: FC<EmailStatusProps> = ({ status, isLoading }) => {
  return <StatusBadge color={status ? statusMap[status] : 'neutral'} isLoading={isLoading}>{status ? statusLabelMap[status] : '-'}</StatusBadge>;
};
