export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Simple Tailwind Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Card 1</h2>
            <p className="text-gray-600">This uses standard Tailwind classes.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Card 2</h2>
            <p className="text-gray-600">Another test card.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Card 3</h2>
            <p className="text-gray-600">Third test card.</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Color Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Blue</div>
              <div className="text-sm opacity-80">Standard</div>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Green</div>
              <div className="text-sm opacity-80">Standard</div>
            </div>
            <div className="bg-yellow-600 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Yellow</div>
              <div className="text-sm opacity-80">Standard</div>
            </div>
            <div className="bg-red-600 text-white p-4 rounded-lg text-center">
              <div className="font-semibold">Red</div>
              <div className="text-sm opacity-80">Standard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
