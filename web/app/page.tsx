// web/app/page.tsx
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-4">My AI Assistant</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Build działa ✅. To jest strona startowa App Routera z własnym
        <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded ml-1">layout.tsx</code>.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Co dalej?</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Dodaj komponenty w <code>web/components/</code>.</li>
          <li>Twórz API route’y w <code>web/app/api/*</code>.</li>
          <li>Konfiguracje trzymaj w <code>web/lib/</code>.</li>
        </ul>
      </section>
    </main>
  );
}
