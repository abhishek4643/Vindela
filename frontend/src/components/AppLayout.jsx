import TopNav from './TopNav';

export default function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav />
      <main style={{ flex: 1, padding: '40px 24px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
      <footer style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', borderTop: '1px solid var(--color-border)' }}>
        © {new Date().getFullYear()} Vindela Fine Dining. All rights reserved.
      </footer>
    </div>
  );
}