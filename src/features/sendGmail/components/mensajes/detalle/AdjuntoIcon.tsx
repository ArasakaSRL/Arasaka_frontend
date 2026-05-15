import { FileText, FileSpreadsheet, Archive, File } from 'lucide-react'

function getExt(nombre: string) {
    return nombre.split('.').pop()?.toLowerCase() ?? ''
}

export default function AdjuntoIcon({ nombre }: { nombre: string }) {
    const ext = getExt(nombre)
    if (ext === 'pdf') return <FileText size={30} className="text-red-400" />
    if (['doc', 'docx'].includes(ext)) return <FileText size={30} className="text-blue-400" />
    if (['xls', 'xlsx'].includes(ext)) return <FileSpreadsheet size={30} className="text-emerald-400" />
    if (['zip', 'rar'].includes(ext)) return <Archive size={30} className="text-amber-400" />
    return <File size={30} className="text-slate-400" />
}
