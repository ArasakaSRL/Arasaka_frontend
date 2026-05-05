export function getHeatmapCoords(e: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect()

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    return { x, y }
}