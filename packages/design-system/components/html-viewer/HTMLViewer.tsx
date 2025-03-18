'use client';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface HTMLViewerProps {
  htmlContent: string;
  className?: string;
}

export const HTMLViewer: FC<HTMLViewerProps> = ({ htmlContent, className }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  // Use client-side only sanitization to avoid SSR issues with DOMPurify
  useEffect(() => {
    // Dynamically import DOMPurify to avoid SSR issues
    import('dompurify').then((DOMPurify) => {
      setSanitizedHtml(DOMPurify.default.sanitize(htmlContent));
    });
  }, [htmlContent]);

  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
