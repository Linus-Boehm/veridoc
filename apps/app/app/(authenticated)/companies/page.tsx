import { auth } from '@repo/auth/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '../components/header';
import { CompanyOverview } from './components/CompanyOverview.tsx';

const title = 'Taxel - Firmen';
const description = 'Verwalten Sie Ihre Firmen';

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
      <Header pages={['Firmen']} page="Alle Firmen" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3" />
        <div className="flex min-h-[100vh] flex-1 flex-col rounded-xl bg-muted/50 md:min-h-min">
          <CompanyOverview />
        </div>
      </div>
    </>
  );
};

export default App;
