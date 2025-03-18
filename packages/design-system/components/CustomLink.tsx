import Link from 'next/link';
import { FC, ReactNode } from "react";

export interface CustomLinkProps {
    href: string;
    children: ReactNode;
    forceHyperlink?: boolean;
}

export const CustomLink: FC<CustomLinkProps> = ({ href, children, forceHyperlink }) => {
      const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

      if (isInternalLink && !forceHyperlink) {
        return (
          <Link href={href} passHref>
            {children}
          </Link>
        );
      }

      return <a href={href}>{children}</a>;
    };



    export const LinkWrapper: FC<Partial<CustomLinkProps>> = ({ children, href }) => {
      if (!href) {
        return children;
      }
      return <CustomLink href={href}>{children}</CustomLink>;
    };