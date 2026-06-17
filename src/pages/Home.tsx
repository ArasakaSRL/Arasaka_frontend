import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import WelcomeLayout from '@/layout/welcomeLayout'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import PortafoliosPreview from '@/components/home/PortafoliosPreview'
import NosotrosSection from '@/components/home/NosotrosSection'
import CtaSection from '@/components/home/CtaSection'

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#nosotros') {
      setTimeout(() => {
        document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    }
  }, [hash])

  return (
    <WelcomeLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PortafoliosPreview />
      <NosotrosSection />
      <CtaSection />
    </WelcomeLayout>
  )
}
