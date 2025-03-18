import { auth } from '@repo/auth/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '#app/(authenticated)/components/header.tsx';
import { EmailDetailView } from './components/EmailDetailView';

const title = 'Taxel - Email Details';
const description = 'View email details';

export const metadata: Metadata = {
  title,
  description,
};

const EmailDetailPage = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    notFound();
  }

  return (
    <>
      <Header pages={['Inbox']} page="Email Details" />
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="flex min-h-[100vh] flex-1 flex-col rounded-xl bg-muted/50 md:min-h-min">
          <EmailDetailView />
        </div>
      </div>
    </>
  );
};

export default EmailDetailPage;
