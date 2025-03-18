# InboundEmails Queries Examples

This document provides examples of how to use the inboundEmails queries in your React components.

## Basic Usage

```tsx
'use client';

import { useInboundEmails, useInboundEmail } from '../src/inboundEmails';

// Component to list emails
function EmailList() {
  // List all emails (not archived)
  const { data: emails, isLoading, error } = useInboundEmails(false);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading emails</div>;
  
  return (
    <div>
      <h2>Emails</h2>
      {emails?.map((email) => (
        <div key={email.id}>
          <div>{email.subject}</div>
          <div>From: {email.fromName}</div>
          <div>{new Date(email.date).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

// Component to show email details
function EmailDetail({ emailId }: { emailId: string }) {
  // Get email details with body content
  const { data: email, isLoading } = useInboundEmail(emailId, true);
  
  if (isLoading) return <div>Loading...</div>;
  if (!email) return <div>Email not found</div>;
  
  return (
    <div>
      <h2>{email.subject}</h2>
      <div>From: {email.fromName} ({email.from})</div>
      <div>To: {email.to}</div>
      <div>Date: {new Date(email.date).toLocaleString()}</div>
      
      <div>
        <h3>Email Body</h3>
        <div>{email.bodyText}</div>
      </div>
      
      {email.documents && email.documents.length > 0 && (
        <div>
          <h3>Attachments</h3>
          <ul>
            {email.documents.map((doc) => (
              <li key={doc.id}>{doc.fileName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Archive Email

```tsx
'use client';

import { useArchiveInboundEmail } from '../src/inboundEmails';

function ArchiveButton({ emailId }: { emailId: string }) {
  const { mutate: archiveEmail, isPending } = useArchiveInboundEmail();
  
  const handleArchive = () => {
    archiveEmail(emailId);
  };
  
  return (
    <button 
      type="button" 
      onClick={handleArchive}
      disabled={isPending}
    >
      {isPending ? 'Archiving...' : 'Archive Email'}
    </button>
  );
}
```

## Download Attachment

```tsx
'use client';

import { useDownloadEmailAttachment } from '../src/inboundEmails';

function DownloadButton({ emailId, documentId, fileName }: { 
  emailId: string;
  documentId: string;
  fileName: string;
}) {
  const { mutate: downloadAttachment, isPending } = useDownloadEmailAttachment();
  
  const handleDownload = () => {
    downloadAttachment({ emailId, documentId });
  };
  
  return (
    <button 
      type="button" 
      onClick={handleDownload}
      disabled={isPending}
    >
      {isPending ? 'Downloading...' : `Download ${fileName}`}
    </button>
  );
}
``` 