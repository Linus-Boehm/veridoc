import { BaseEntityBadgeProps, EntityBadge } from "./EntityBadge";
import { FileIcon } from "lucide-react";

interface DocumentBadgeProps extends BaseEntityBadgeProps {
  documentId: string;
  documentName: string;
}

export const DocumentBadge = ({ documentId, documentName, ...props }: DocumentBadgeProps) => {
  const documentPath = `/documents/${documentId}`;
  return (
    <EntityBadge 
      icon={<FileIcon className="h-4 w-4 text-blue-600" />} 
      href={documentPath} 
      title="Dokument öffnen" 
      {...props}
    >
      {documentName}
    </EntityBadge>
  );
}; 