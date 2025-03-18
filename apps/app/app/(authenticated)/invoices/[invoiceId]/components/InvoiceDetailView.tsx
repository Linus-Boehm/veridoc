'use client';
import { PDFViewer } from '@repo/design-system/components/pdf-viewer/PDFViewer';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/Resizeable';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { useInvoice } from '@taxel/queries/src/invoices';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { LineItemOverview } from './LineItemOverview';
import { InvoiceDetailCard } from './InvoiceDetailCard';
export const InvoiceDetailView: FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const { data: invoice, status } = useInvoice(invoiceId);

  const fileUrl = invoice?.document?.storageResource?.getUrl;

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="vertical" className="h-full w-full">
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={70}>
              <div className="max-h-full w-full overflow-auto p-4">
                <div className="flex min-h-0 flex-1 flex-col">
                  {status === 'pending' && <div>Loading...</div>}
                  {status === 'success' && fileUrl && (
                    <PDFViewer fileUrl={fileUrl} />
                  )}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
              <div className="flex flex-1 flex-col p-4 ">
                <InvoiceDetailCard invoice={invoice} status={status} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <div className="flex h-full flex-1 flex-col">
            <LineItemOverview invoice={invoice} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
