import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2">My AI Assistant</h1>
      <p className="text-gray-600">Połączony frontend z backendem.</p>
      <Chat />
    </main>
  );
}
