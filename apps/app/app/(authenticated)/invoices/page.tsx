import { auth } from '@repo/auth/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '../components/header';
import { InvoiceOverview } from './components/InvoiceOverview';
const title = 'Taxel - Invoices';
const description = 'View your invoices';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    notFound();
  }

  return (
    <>
      <Header pages={['Invoices']} page="All Invoices"></Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3"></div>
        <div className="flex min-h-[100vh] flex-1 flex-col rounded-xl bg-muted/50 md:min-h-min">
          <InvoiceOverview />
        </div>
      </div>
    </>
  );
};

export default App;
