import type { FC, ReactElement } from 'react';
import {
  type ColorVariants,
  StatusBadge,
} from '#components/ui/Badge/StatusBadge.tsx';
import { ArchiveXIcon, BanIcon, CheckCheckIcon, CloudUploadIcon, FileTextIcon, GitPullRequestArrowIcon, Grid2X2CheckIcon, ShieldXIcon } from 'lucide-react';
export interface InvoiceStatusProps {
  status: InvoiceStatus;
}

type InvoiceStatus =
  | 'received'
  | 'captured'
  | 'in_approval'
  | 'approved'
  | 'rejected'
  | 'booked'
  | 'archived'
  | 'conflict';

const statusMap: Record<InvoiceStatus, ColorVariants> = {
  received: 'neutral',
  captured: 'info',
  in_approval: 'accent_purple',
  approved: 'primary',
  rejected: 'error',
  booked: 'success',
  archived: 'warning',
  conflict: 'error',
};

const statusLabelMap: Record<InvoiceStatus, string> = {
  received: 'Empfangen',
  captured: 'Erfasst',
  in_approval: 'In Genehmigung',
  approved: 'Genehmigt',
  rejected: 'Abgelehnt',
  booked: 'Gebucht',
  archived: 'Archiviert',
  conflict: 'Konflikt',
};

const statusIconMap: Record<
  InvoiceStatus,
  ReactElement<{ className?: string }>
> = {
  received: <CloudUploadIcon />,
  captured: <FileTextIcon />,
  in_approval: <GitPullRequestArrowIcon />,
  approved: <CheckCheckIcon />,
  rejected: <BanIcon />,
  booked: <Grid2X2CheckIcon />,
  archived: <ArchiveXIcon />,
  conflict: <ShieldXIcon />,
};

export const InvoiceStatus: FC<InvoiceStatusProps> = ({ status }) => {
  return <StatusBadge color={statusMap[status]} icon={statusIconMap[status]}>{statusLabelMap[status]}</StatusBadge>;
};
