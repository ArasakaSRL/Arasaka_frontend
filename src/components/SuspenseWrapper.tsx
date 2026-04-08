import React, { Suspense } from 'react'

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<section id="center"><p>Cargando vista...</p></section>}>
      {children}
    </Suspense>
  )
}
