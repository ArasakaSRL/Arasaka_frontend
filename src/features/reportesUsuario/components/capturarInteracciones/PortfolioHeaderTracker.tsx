import { useEffect, useRef } from "react"

// PortfolioHeaderTracker.tsx
const VISITOR_KEY = 'hf_visitor'

export function PortfolioHeaderTracker({
    children,
    portfolioSlug
}: {
    children:      React.ReactNode
    portfolioSlug: string
}) {
    const wrapperRef  = useRef<HTMLDivElement>(null)
    const hoverTimers = useRef<Record<string, number>>({})

    // ── Inicialización ──
    useEffect(() => {
        let visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) {
            visitorId = crypto.randomUUID()
            localStorage.setItem(VISITOR_KEY, visitorId)
        }
        navigator.sendBeacon(
            '/api/heatmap/iniciar',
            JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug
            })
        )
    }, [portfolioSlug])

    function getVisitorId() {
        return localStorage.getItem(VISITOR_KEY)
    }

    // ── Captura de clics con coordenadas ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onClic(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-track]')
            if (!target) return

            const elemento = (target as HTMLElement).dataset.track!
            const rect     = target.getBoundingClientRect()
            const x        = (e.clientX - rect.left) / rect.width
            const y        = (e.clientY - rect.top)  / rect.height
            const visitorId = getVisitorId()
            if (!visitorId) return

            // Request 1 — incrementa el contador en interaccion_perfil
            navigator.sendBeacon(
                '/api/heatmap/perfil/clic',
                JSON.stringify({
                    visitor_id:     visitorId,
                    portfolio_slug: portfolioSlug,
                    elemento,           // "clic_foto_perfil", "clic_github"...
                })
            )

            // Request 2 — guarda la coordenada exacta en clic_perfil
            navigator.sendBeacon(
                '/api/heatmap/perfil/clic-posicion',
                JSON.stringify({
                    visitor_id:     visitorId,
                    portfolio_slug: portfolioSlug,
                    elemento,
                    x,
                    y
                })
            )
        }

        el.addEventListener('click', onClic)
        return () => el.removeEventListener('click', onClic)
    }, [portfolioSlug])

    // ── Captura de hovers ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onEnter(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-hover]')
            if (!target) return
            const zona = (target as HTMLElement).dataset.hover!
            hoverTimers.current[zona] = Date.now()
        }

        function onLeave(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-hover]')
            if (!target) return
            const zona   = (target as HTMLElement).dataset.hover!
            const inicio = hoverTimers.current[zona]
            if (!inicio) return

            const ms = Date.now() - inicio
            delete hoverTimers.current[zona]
            if (ms < 200) return

            const visitorId = getVisitorId()
            if (!visitorId) return

            navigator.sendBeacon(
                '/api/heatmap/perfil/hover',
                JSON.stringify({
                    visitor_id:     visitorId,
                    portfolio_slug: portfolioSlug,
                    zona,   // "foto", "correo"
                    ms
                })
            )
        }

        el.addEventListener('mouseover', onEnter)
        el.addEventListener('mouseout',  onLeave)
        return () => {
            el.removeEventListener('mouseover', onEnter)
            el.removeEventListener('mouseout',  onLeave)
        }
    }, [portfolioSlug])

    return <div ref={wrapperRef}>{children}</div>
}