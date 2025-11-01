import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/feature-section'
import AppFooter from '@/components/footer'

export default function Page() {
  return (
    <main className="relative">
      <HeroSection />
      <FeaturesSection />
      <AppFooter />
    </main>
  )
}
