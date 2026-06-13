import apiClient from '@/api/api'
import React, { useEffect, useRef } from 'react'
import { getHeatmapCoords } from '../../utils/heatmap'

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''

interface Props {
    children: React.ReactNode
    portfolioSlug: string
}

export function HabilidadesTecnicasTracker({
    children,
    portfolioSlug
}: Props) {

    const wrapperRef = useRef<HTMLDivElement>(null)

    function enviarCoordenadas(
        idHabilidad: string,
        campo: string,
        x: number,
        y: number
    ) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        const payload = new Blob(
            [JSON.stringify({
                visitor_id: visitorId,
                portfolio_slug: portfolioSlug,
                id_habilidad: idHabilidad,
                campo,
                x,
                y
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(
            `${API_BASE}/api/public/heatmap/habilidades-tecnicas/clic-coords`,
            payload
        )
    }

    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onClick(e: MouseEvent) {
            console.log('CLICK TECNICAS')

            const container = wrapperRef.current
            if (!container) return

            const coords = getHeatmapCoords(e, container)

            const target = (e.target as HTMLElement)
                .closest('[data-habilidad-id]')
                console.log('TARGET', target)
            if (!target) return

            const id = (target as HTMLElement)
                .dataset.habilidadId!

                console.log('ID', id)
                console.log('COORDS', coords)
                
            enviarCoordenadas(
                id,
                'clic_general',
                coords.x,
                coords.y
            )
        }

        el.addEventListener('click', onClick)

        return () => {
            el.removeEventListener('click', onClick)
        }
    }, [portfolioSlug])

    return (
        <div ref={wrapperRef}>
            {children}
        </div>
    )
}