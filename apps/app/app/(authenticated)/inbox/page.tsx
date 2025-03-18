import { Header } from '../components/header';
import { InboxView } from './components/InboxView';

export default function InboxPage() {
  return (
    <>
      <Header pages={['Inbox']} page="Inbox"></Header>
      <InboxView />
    </>
  );
}
