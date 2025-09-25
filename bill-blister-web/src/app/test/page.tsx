export default function TestPage() {
  return (
    <div className="min-h-screen bg-surface-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-navy mb-8">Tailwind CSS Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface p-6 rounded-xl shadow-soft border border-gray-200">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Card 1</h2>
            <p className="text-text-secondary">This is a test card with proper styling.</p>
          </div>
          
          <div className="bg-surface p-6 rounded-xl shadow-soft border border-gray-200">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Card 2</h2>
            <p className="text-text-secondary">Another test card to verify styling.</p>
          </div>
          
          <div className="bg-surface p-6 rounded-xl shadow-soft border border-gray-200">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Card 3</h2>
            <p className="text-text-secondary">Third test card for grid layout.</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-xl shadow-soft border border-gray-200">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Color Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-navy text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Navy</div>
              <div className="text-sm opacity-80">Primary</div>
            </div>
            <div className="bg-success text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Success</div>
              <div className="text-sm opacity-80">Green</div>
            </div>
            <div className="bg-warning text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Warning</div>
              <div className="text-sm opacity-80">Orange</div>
            </div>
            <div className="bg-error text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Error</div>
              <div className="text-sm opacity-80">Red</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}