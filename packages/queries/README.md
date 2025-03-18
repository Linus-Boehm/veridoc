# Queries Package

This package contains React Query hooks for interacting with the API.

## Usage

Import the hooks directly from their specific files to ensure proper tree-shaking and code splitting in Next.js:

```tsx
// Good: Import directly from the specific file
import { useInboundEmails, useInboundEmail } from '@repo/queries/src/inboundEmails';

// Bad: Don't import from a barrel file (index.ts)
// import { useInboundEmails } from '@repo/queries';
```

## Available Hooks

### Inbound Emails

```tsx
import { 
  useInboundEmails, 
  useInboundEmail,
  useArchiveInboundEmail,
  useDownloadEmailAttachment
} from '@repo/queries/src/inboundEmails';

// List emails
const { data: emails, isLoading } = useInboundEmails(false); // false = don't include archived

// Get a single email
const { data: email } = useInboundEmail(emailId, true); // true = include email body details

// Archive an email
const { mutate: archiveEmail } = useArchiveInboundEmail();
archiveEmail(emailId);

// Download an attachment
const { mutate: downloadAttachment } = useDownloadEmailAttachment();
downloadAttachment({ emailId, documentId });
```

### Invoices

```tsx
import { useInvoices, useInvoice } from '@repo/queries/src/invoices';

// List invoices
const { data: invoices } = useInvoices();

// Get a single invoice
const { data: invoice } = useInvoice(invoiceId);
```

## Best Practices

1. Always import directly from the specific file to ensure proper tree-shaking
2. Use the hooks in React components only (they use React hooks internally)
3. Handle loading, error, and success states appropriately 