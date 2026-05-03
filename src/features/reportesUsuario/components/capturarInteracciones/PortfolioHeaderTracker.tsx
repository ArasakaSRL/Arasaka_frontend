import { useEffect, useRef } from 'react'

const VISITOR_KEY = 'hf_visitor'
const API_BASE    = 'http://localhost:8000'//no olvidar colocar el link deploy

interface Props {
    children:      React.ReactNode
    portfolioSlug: string
}

export function PortfolioHeaderTracker({ children, portfolioSlug }: Props) {
    const wrapperRef  = useRef<HTMLDivElement>(null)
    const hoverTimers = useRef<Record<string, number>>({})

    function enviar(campo: string, valor: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        // ── LOG TEMPORAL ──
        console.log('📊 Heatmap track:', {
            campo,
            valor,
            visitor_id:     visitorId,
            portfolio_slug: portfolioSlug,
            timestamp:      new Date().toISOString()
        })
        // ── FIN LOG TEMPORAL ──

        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug,
                campo,
                valor
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(`${API_BASE}/api/public/heatmap/perfil/track`, payload)
    }

    // ── Clics ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onClic(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-track]')
            if (!target) return
            const campo = (target as HTMLElement).dataset.track!
            enviar(campo, 1)
        }

        el.addEventListener('click', onClic)
        return () => el.removeEventListener('click', onClic)
    }, [portfolioSlug])

    // ── Hovers ──
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

            enviar(`hover_${zona}_count`, 1)
            enviar(`hover_${zona}_ms`, ms)
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