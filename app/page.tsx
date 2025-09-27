// src/app/page.tsx
'use client'

import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/feature-section'

export default function Page() {
  return (
    <main className="bg-gray-900">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
