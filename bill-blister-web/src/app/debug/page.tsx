export default function DebugPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fb' }}>
      <h1 style={{ color: '#1A1B3A', fontSize: '24px', marginBottom: '20px' }}>Debug Page</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 15px -3px rgb(0 0 0 / 0.07), 0 10px 20px -2px rgb(0 0 0 / 0.04)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#1A1B3A', fontSize: '18px', marginBottom: '10px' }}>Inline Styles Test</h2>
        <p style={{ color: '#6B7280' }}>This should show the correct colors and styling.</p>
      </div>
      
      <div className="bg-surface p-6 rounded-xl shadow-soft border border-gray-200">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Tailwind Classes Test</h2>
        <p className="text-text-secondary">This should show the same styling as above if Tailwind is working.</p>
      </div>
    </div>
  );
}
