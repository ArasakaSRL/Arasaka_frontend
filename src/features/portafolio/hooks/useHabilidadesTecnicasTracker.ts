import apiClient from "@/api/api"
import { getHeatmapCoords } from "@/features/reportesUsuario/utils/heatmap"

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''

export function useHabilidadesTecnicasTracker(portfolioSlug: string) {

    function enviarCoordenadas(idHabilidad: string, campo: string, x: number, y: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return
        const payload = new Blob(
            [JSON.stringify({ visitor_id: visitorId, portfolio_slug: portfolioSlug, id_habilidad: idHabilidad, campo, x, y })],
            { type: 'application/json' }
        )
        navigator.sendBeacon(`${API_BASE}/api/public/heatmap/habilidades-tecnicas/clic-coords`, payload)
    }

    function enviar(idHabilidad: string, campo: string, valor: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        console.log('📊 Habilidad técnica:', { idHabilidad, campo, valor }) // temporal

        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug,
                id_habilidad:   idHabilidad,
                campo,
                valor
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(
            `${API_BASE}/api/public/heatmap/habilidades-tecnicas/track`,
            payload
        )
    }

    function trackExpandir(idHabilidad: string, e?: MouseEvent, container?: HTMLElement) {
    console.log('TRACK EXPANDIR', idHabilidad)
        enviar(idHabilidad, 'clic_expandir', 1)
        if (e && container) {
            const coords = getHeatmapCoords(e, container)
            enviarCoordenadas(idHabilidad, 'clic_expandir', coords.x, coords.y)
        }
    }

    function trackCerrar(idHabilidad: string, e?: MouseEvent, container?: HTMLElement) {
        enviar(idHabilidad, 'clic_cerrar', 1)
        if (e && container) {
            const coords = getHeatmapCoords(e, container)
            enviarCoordenadas(idHabilidad, 'clic_cerrar', coords.x, coords.y)
        }
    }
    return { trackExpandir, trackCerrar }
}