import apiClient from "@/api/api"


const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''  // ← sin barra al final

export function useVisitor() {

    function getOrCreateVisitorId(): string {
        let id = localStorage.getItem(VISITOR_KEY)
        if (!id) {
            id = typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                    const r = Math.random() * 16 | 0
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
                  })
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