import { useRef, useState } from 'react'
import { Send, Loader2, Paperclip, X, UploadCloud, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

const ACCEPTED = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip,.rar'
const MAX_FILES = 3
const MAX_MB = 10

interface FormData {
    from: string
    subject: string
    content: string
    nombre_remitente: string
}

interface Props {
    form: FormData
    files: File[]
    loading: boolean
    error: string | null
    onChange: (field: keyof FormData, val: string) => void
    onFilesChange: (files: File[]) => void
    onSubmit: (e: React.FormEvent) => void
    onVolver: () => void
}

function fileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase() ?? ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️'
    if (ext === 'pdf') return '📄'
    if (['doc', 'docx'].includes(ext)) return '📝'
    if (['xls', 'xlsx'].includes(ext)) return '📊'
    if (['zip', 'rar'].includes(ext)) return '🗜️'
    return '📎'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function FormularioCorreo({ form, files, loading, error, onChange, onFilesChange, onSubmit, onVolver }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)
    const [fileError, setFileError] = useState<string | null>(null)
    const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})

    function touch(field: keyof FormData) {
        setTouched(p => ({ ...p, [field]: true }))
    }

    // Devuelve el error del campo si ha sido tocado, o undefined si no hay error o no ha sido tocado
    function getError(field: keyof FormData): string | undefined {
        if (!touched[field]) return undefined
        if (field === 'from') {
            if (!form.from.trim()) return 'Campo obligatorio'
            if (!EMAIL_RE.test(form.from)) return 'Correo inválido'
        }
        if (field === 'subject' && !form.subject.trim()) return 'Campo obligatorio'
        if (field === 'content' && !form.content.trim()) return 'Campo obligatorio'
    }

    const isValid = !!form.from.trim() && EMAIL_RE.test(form.from) && !!form.subject.trim() && !!form.content.trim()

    function handleSubmit(e: React.FormEvent) {
        setTouched({ from: true, subject: true, content: true })
        if (!isValid) { e.preventDefault(); return }
        onSubmit(e)
    }

    function addFiles(incoming: FileList | null) {
        if (!incoming) return
        setFileError(null)
        const next = [...files]
        let limitReached = false
        for (const f of Array.from(incoming)) {
            if (next.length >= MAX_FILES) { limitReached = true; break }
            if (f.size > MAX_MB * 1024 * 1024) { setFileError(`"${f.name}" supera ${MAX_MB}MB`); continue }
            if (!next.find(x => x.name === f.name && x.size === f.size)) next.push(f)
        }
        if (limitReached) setFileError('limit')
        onFilesChange(next)
    }

    function removeFile(i: number) {
        onFilesChange(files.filter((_, idx) => idx !== i))
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <button
                type="button"
                onClick={onVolver}
                className="text-white/40 hover:text-white text-ms -mt-4 self-start transition-colors"
            >
                ← Volver
            </button>

            <div className="[&_label]:text-white/70 [&_label]:font-medium [&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder:text-white/20 [&_input]:focus:ring-blue-500/40 [&_input]:focus:border-blue-500/50 [&_input]:rounded-xl">
                <Input
                    label="Tu nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={form.nombre_remitente}
                    onChange={v => { onChange('nombre_remitente', v); touch('nombre_remitente' as keyof FormData) }}
                />
            </div>

            <div className="[&_label]:text-white/70 [&_label]:font-medium [&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder:text-white/20 [&_input]:focus:ring-blue-500/40 [&_input]:focus:border-blue-500/50 [&_input]:rounded-xl">
                <Input
                    label="Tu correo"
                    type="text"
                    placeholder="tu@correo.com"
                    value={form.from}
                    onChange={v => { onChange('from', v); touch('from') }}
                    maxLength={50}
                    error={getError('from')}
                />
            </div>

            <div className="[&_label]:text-white/70 [&_label]:font-medium [&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder:text-white/20 [&_input]:focus:ring-blue-500/40 [&_input]:focus:border-blue-500/50 [&_input]:rounded-xl">
                <Input
                    label="Asunto"
                    type="text"
                    placeholder="Asunto del mensaje"
                    value={form.subject}
                    onChange={v => { onChange('subject', v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')); touch('subject') }}
                    maxLength={120}
                    error={getError('subject')}
                />
            </div>

            <div className="[&_label]:text-white/70 [&_label]:font-medium [&_textarea]:bg-white/5 [&_textarea]:border-white/10 [&_textarea]:text-white [&_textarea]:placeholder:text-white/20 [&_textarea]:focus:ring-blue-500/40 [&_textarea]:focus:border-blue-500/50 [&_textarea]:rounded-xl">
                <Input
                    label="Mensaje"
                    type="textarea"
                    placeholder="Escribe tu mensaje..."
                    value={form.content}
                    onChange={v => { onChange('content', v); touch('content') }}
                    maxLength={2000}
                    showCounter
                    error={getError('content')}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs font-medium flex items-center gap-1.5">
                    <Paperclip size={13} /> Adjuntos <span className="text-white/30">(opcional · máx. {MAX_FILES} archivos · {MAX_MB}MB c/u)</span>
                </label>

                <div
                    onClick={() => files.length < MAX_FILES && inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); if (files.length < MAX_FILES) setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                    className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl py-5 transition-colors
                        ${files.length >= MAX_FILES
                            ? 'border-white/5 bg-white/2 cursor-not-allowed opacity-50'
                            : dragging
                                ? 'border-blue-500/60 bg-blue-500/10 cursor-pointer'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07] cursor-pointer'
                        }`}
                >
                    <UploadCloud size={22} className="text-white/30" />
                    <p className="text-white/40 text-xs">Arrastra archivos o <span className="text-blue-400 underline">selecciona</span></p>
                    <p className="text-white/20 text-[10px]">Imágenes · PDF · Office · ZIP · RAR · TXT · CSV</p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED}
                    className="hidden"
                    onChange={e => addFiles(e.target.files)}
                />

                {fileError === 'limit' ? (
                    <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                        <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-amber-300 text-xs font-semibold">Límite de archivos alcanzado</p>
                            <p className="text-amber-400/70 text-[11px]">Solo puedes adjuntar un máximo de {MAX_FILES} archivos por mensaje.</p>
                        </div>
                    </div>
                ) : fileError ? (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                        <AlertCircle size={15} className="text-red-400 shrink-0" />
                        <p className="text-red-300 text-xs">{fileError}</p>
                    </div>
                ) : null}

                {files.length > 0 && (
                    <ul className="flex flex-col gap-1.5 mt-1">
                        {files.map((f, i) => (
                            <li key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                <span className="flex items-center gap-2 text-xs text-white/70 truncate">
                                    <span>{fileIcon(f.name)}</span>
                                    <span className="truncate max-w-50">{f.name}</span>
                                    <span className="text-white/30 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                                </span>
                                <button type="button" onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 transition-colors ml-2">
                                    <X size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
                type="submit"
                disabled={loading || !isValid}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
        </form>
    )
}
