import Chat from "@/components/Chat";
import Reminders from "@/components/Reminders";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-2">My AI Assistant</h1>
        <p className="text-gray-600">
          Połączony frontend z backendem (Chat + Przypomnienia).
        </p>
      </header>

      {/* Sekcja czatu (LLM) */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Chat</h2>
        <Chat />
      </section>

      {/* Sekcja przypomnień */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Przypomnienia</h2>
        <Reminders />
      </section>
    </main>
  );
}
