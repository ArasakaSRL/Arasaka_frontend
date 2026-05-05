import apiClient from "@/api/api"

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''

export function useHabilidadesTecnicasTracker(portfolioSlug: string) {

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

    function trackExpandir(idHabilidad: string) {
        enviar(idHabilidad, 'clic_expandir', 1)
    }

    function trackCerrar(idHabilidad: string) {
        enviar(idHabilidad, 'clic_cerrar', 1)
    }

    return { trackExpandir, trackCerrar }
}