// src/features/reportesUsuario/components/capturarInteracciones/ExperienciaTracker.tsx

import { useEffect, useRef } from 'react'

const VISITOR_KEY = 'hf_visitor'
const API_BASE    = 'http://localhost:8000'

interface Props {
    children:      React.ReactNode
    portfolioSlug: string
}

export function ExperienciaTracker({ children, portfolioSlug }: Props) {
    const wrapperRef  = useRef<HTMLDivElement>(null)
    const hoverTimers = useRef<Record<string, number>>({})

    function enviar(idExperiencia: string, campo: string, valor: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        console.log('📊 Experiencia track:', {
            idExperiencia,
            campo,
            valor,
            portfolio_slug: portfolioSlug,
        })

        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug,
                id_experiencia: idExperiencia,
                campo,
                valor
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(
            `${API_BASE}/api/public/heatmap/experiencia/track`,
            payload
        )
    }

    // ── Hovers ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onEnter(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-experiencia-id]')
            if (!target) return
            const id = (target as HTMLElement).dataset.experienciaId!
            hoverTimers.current[id] = Date.now()
        }

        function onLeave(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-experiencia-id]')
            if (!target) return
            const id     = (target as HTMLElement).dataset.experienciaId!
            const inicio = hoverTimers.current[id]
            if (!inicio) return

            const ms = Date.now() - inicio
            delete hoverTimers.current[id]
            if (ms < 200) return

            enviar(id, 'hover_count', 1)
            enviar(id, 'hover_ms', ms)
        }

        el.addEventListener('mouseover', onEnter)
        el.addEventListener('mouseout',  onLeave)
        return () => {
            el.removeEventListener('mouseover', onEnter)
            el.removeEventListener('mouseout',  onLeave)
        }
    }, [portfolioSlug])

    // ── Visibilidad ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        const yaVistos = new Set<string>()

        const items = el.querySelectorAll('[data-experiencia-id]')

        items.forEach(item => {
            const id = (item as HTMLElement).dataset.experienciaId!

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !yaVistos.has(id)) {
                        yaVistos.add(id)
                        enviar(id, 'fue_visible', 1)
                        observer.disconnect()
                    }
                },
                { threshold: 0.15 }
            )

            observer.observe(item)
        })
    }, [portfolioSlug])

    return <div ref={wrapperRef}>{children}</div>
}