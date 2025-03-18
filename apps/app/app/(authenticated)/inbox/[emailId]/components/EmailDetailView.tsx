'use client';
import { HTMLViewer } from '@repo/design-system/components/html-viewer/HTMLViewer';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/Resizeable';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { useInboundEmail } from '@taxel/queries/src/inboundEmails';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { EmailAttachmentsCard } from './EmailAttachmentsCard.tsx';
import { EmailDetailCard } from './EmailDetailCard.tsx';

export const EmailDetailView: FC = () => {
  const { emailId } = useParams<{ emailId: string }>();

  // Fetch email with details (including body content)
  const { data: email, status } = useInboundEmail(emailId, true);

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={70}>
          <div className="max-h-full w-full overflow-auto p-4">
            <div className="flex min-h-0 flex-1 flex-col">
              {status === 'pending' && (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-10 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="mt-4 h-[400px] w-full" />
                </div>
              )}
              {status === 'error' && <div>Error loading email</div>}
              {status === 'success' && email && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-semibold text-2xl">{email.subject}</h2>
                  <div className="text-muted-foreground text-sm">
                    <span>
                      From: {email.fromName} &lt;{email.from}&gt;
                    </span>
                    <br />
                    <span>To: {email.to}</span>
                    {email.cc && (
                      <>
                        <br />
                        <span>CC: {email.cc}</span>
                      </>
                    )}
                    {email.bcc && (
                      <>
                        <br />
                        <span>BCC: {email.bcc}</span>
                      </>
                    )}
                    <br />
                    <span>Date: {new Date(email.date).toLocaleString()}</span>
                  </div>
                  <div className="mt-4 rounded-md border bg-background p-4">
                    {email.bodyHtml ? (
                      <HTMLViewer
                        htmlContent={email.bodyHtml}
                        className="prose dark:prose-invert max-w-none"
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap">
                        {email.bodyText}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <EmailDetailCard email={email} status={status} />
            <EmailAttachmentsCard email={email} status={status} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
