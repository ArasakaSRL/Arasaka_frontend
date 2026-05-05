import apiClient from "@/api/api"

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''  // ← sin barra al final

export function useVisitor() {

    function getOrCreateVisitorId(): string {
        let id = localStorage.getItem(VISITOR_KEY)
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem(VISITOR_KEY, id)
        }
        return id
    }

    function iniciarVisita(portfolioSlug: string): void {
        const visitorId = getOrCreateVisitorId()

        console.log('Enviando a:', `${API_BASE}/api/public/heatmap/iniciar`)

        // sendBeacon necesita Blob con tipo application/json
        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug
            })],
            { type: 'application/json' }  
        )

        navigator.sendBeacon(
            `${API_BASE}/api/public/heatmap/iniciar`,
            payload
        )
    }

    return { iniciarVisita }
}