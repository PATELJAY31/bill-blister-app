'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to amount allocation page as the default route
    router.push('/amount-allocation');
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-navy mx-auto mb-4"></div>
        <p className="text-text-secondary">Redirecting to Bill Blister App...</p>
      </div>
    </div>
  );
}