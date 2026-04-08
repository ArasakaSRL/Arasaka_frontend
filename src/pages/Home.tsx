import WelcomeLayout from '@/layout/welcomeLayout'

export default function Home() {
  return (
    <WelcomeLayout>

      <section className="py-20 bg-[#1e2a5e] text-white text-center">
        <h2 className="text-3xl font-bold mb-6 italic tracking-tight">
          ¿Listo para gestionar tu portafolio?
        </h2>
        <button className="bg-white text-[#1e2a5e] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all">
          Empezar Ahora
        </button>
      </section>

    </WelcomeLayout>
  )
}