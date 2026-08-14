export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <iframe
        src="/cookbook/index.html"
        title="High Protein Cookbook"
        style={{ border: 0, height: '100%', width: '100%' }}
      />
    </main>
  );
}
