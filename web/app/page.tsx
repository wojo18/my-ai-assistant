// web/app/page.tsx
export default function Home() {
  return (
    <main style={{ padding: '24px', maxWidth: 920, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>My AI Assistant</h1>
      <p style={{ opacity: 0.8 }}>
        Build powinien przejść ✅. To jest strona startowa App Routera z własnym
        <code> layout.tsx</code>.
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>Co dalej?</h2>
        <ul>
          <li>Dodaj własne komponenty w <code>web/components/</code>.</li>
          <li>Endpointy (Edge/route handlers) w <code>web/app/api/*</code>.</li>
          <li>Konfiguracje trzymaj w <code>web/lib/</code>.</li>
        </ul>
      </section>
    </main>
  );
}
