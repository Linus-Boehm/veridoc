'use client';

import { DataGridProvider } from '@repo/design-system/components/datagrid/DataGridProvider';
import { NavigateToCellWrapper } from '@repo/design-system/components/datagrid/cells/NavigateToCellWrapper';
import type { CellRendererProps } from '@repo/design-system/components/datagrid/cells/types';
import { createColumn } from '@repo/design-system/components/datagrid/columnHelpers';
import { Badge } from '@repo/design-system/components/ui/badge';
import type { InboundEmailDTO } from '@taxel/domain/src/inboundEmail';
import { useInboundEmails } from '@taxel/queries/src/inboundEmails';
import { usePostboxes } from '@taxel/queries/src/postboxes';
import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { useMemo } from 'react';
import { InboxTable } from './InboxTable';
import { EmailStatusBadge } from '@repo/design-system/components/domains/email/EmailStatusBadge';

const title = 'Taxel - Inbox';
const description = 'Nachrichten';

export const metadata: Metadata = {
  title,
  description,
};

// Helper function to get a shortened UUID
const shortenUuid = (uuid: string) => {
  return uuid.split('-')[0];
};

export function InboxView() {
  const { data: postboxes } = usePostboxes();
  const { data: emails, isLoading } = useInboundEmails();

  // Create a map of postbox IDs to names for easy lookup
  const postboxMap =
    postboxes?.reduce(
      (acc, postbox) => {
        acc[postbox.id] = postbox.name;
        return acc;
      },
      {} as Record<string, string>
    ) || {};

  const colDefs = useMemo(() => {
    return [
      createColumn<InboundEmailDTO, string>({
        colId: 'subject',
        headerName: 'Betreff',
        type: 'text',
        valueGetter: (row) => row.data?.subject || '',
        cellRenderer: (props: CellRendererProps<InboundEmailDTO, string>) => (
          <NavigateToCellWrapper
            element={props.eGridCell}
            openButton={
              <Link href={`/inbox/${props.data?.id}`} prefetch={false}>
                Öffnen <ExternalLink className="ml-1 size-3 font-xs" />
              </Link>
            }
          >
            {props.value}
          </NavigateToCellWrapper>
        ),
      }),
      createColumn<InboundEmailDTO, string>({
        colId: 'date',
        headerName: 'Datum',
        type: 'text',
        valueGetter: (row) => row.data?.date || '',
      }),
      createColumn<InboundEmailDTO, string>({
        colId: 'postbox',
        headerName: 'Postfach',
        type: 'text',
        valueGetter: (row) => {
          const postboxId = row.data?.postboxId;
          return postboxId ? postboxMap[postboxId] || postboxId : '';
        },
      }),
      createColumn<InboundEmailDTO, string>({
        colId: 'from',
        headerName: 'Absender',
        type: 'text',
        valueGetter: (row) => {
          const { fromName, from } = row.data || {};
          return fromName && from ? `${fromName} <${from}>` : from || '';
        },
      }),
      createColumn<InboundEmailDTO, string>({
        colId: 'attachments',
        headerName: 'Anhänge',
        type: 'text',
        valueGetter: (row) => {
          const documents = row.data?.documents;
          return documents ? documents.length : 0;
        },
      }),
      createColumn<InboundEmailDTO, string>({
        colId: 'status',
        headerName: 'Status',
        type: 'text',
        cellRenderer: (props: { data?: InboundEmailDTO }) => {
          return props.data?.status ? (
            <EmailStatusBadge status={props.data.status} />
          ) : null;
        },
      }),
    ];
  }, [postboxMap]);

  return (
    <div className="flex flex-1 flex-col">
      <DataGridProvider
        rows={emails ?? []}
        isLoading={isLoading}
        colDefs={colDefs}
      >
        <InboxTable />
      </DataGridProvider>
    </div>
  );
}
