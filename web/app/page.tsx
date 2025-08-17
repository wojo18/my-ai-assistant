import './globals.css';
import Chat from '../components/Chat';
import Reminders from '../components/Reminders';

export default function Page(){
  return (
    <main className="container">
      <h1>Prywatny Asystent AI</h1>
      <Chat />
      <Reminders />
    </main>
  );
}
