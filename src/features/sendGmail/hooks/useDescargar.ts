import { useState } from 'react'

export function useDescargar() {
    const [descargando, setDescargando] = useState(false)

    async function descargar(url: string, nombre: string) {
        if (descargando) return
        setDescargando(true)
        try {
            const res = await fetch(url)
            const blob = await res.blob()
            const blobUrl = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = nombre
            a.click()
            URL.revokeObjectURL(blobUrl)
        } finally {
            setDescargando(false)
        }
    }

    return { descargar, descargando }
}
