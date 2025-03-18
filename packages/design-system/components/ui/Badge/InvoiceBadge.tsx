import { BaseEntityBadgeProps, EntityBadge } from "./EntityBadge";
import { ReceiptIcon } from "lucide-react";

interface InvoiceBadgeProps extends BaseEntityBadgeProps {
  invoiceId: string;
  invoiceNumber?: string;
  fileName: string;
}

export const InvoiceBadge = ({ invoiceId, invoiceNumber, fileName, ...props }: InvoiceBadgeProps) => {
  const invoicePath = `/invoices/${invoiceId}`;
  const displayText = invoiceNumber ? `${invoiceNumber} - ${fileName}` : fileName;
  
  return (
    <EntityBadge
      icon={<ReceiptIcon className="h-4 w-4 text-purple-500" />}
      href={invoicePath}
      title="Rechnung öffnen"
      {...props}
    >
      {displayText}
    </EntityBadge>
  );
}; 