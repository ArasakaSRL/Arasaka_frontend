import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendGmail } from '@/features/sendGmail/api/sendGmail'
import OpcionesContacto from './contactar/OpcionesContacto'
import FormularioCorreo from './contactar/FormularioCorreo'
import EnvioExitoso from './contactar/EnvioExitoso'

interface Props {
    open: boolean
    onClose: () => void
    correoDestinatario: string
    nombreDestinatario: string
    whatsappNumber?: string
}

type Modo = 'elegir' | 'gmail'

export default function ContactarModal({ open, onClose, correoDestinatario, nombreDestinatario, whatsappNumber }: Props) {
    const [modo, setModo] = useState<Modo>('elegir')
    const [form, setForm] = useState({ from: '', subject: '', content: '', nombre_remitente: '' })
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function handleClose() {
        onClose()
        setTimeout(() => {
            setModo('elegir')
            setForm({ from: '', subject: '', content: '', nombre_remitente: '' })
            setFiles([])
            setEnviado(false)
            setError(null)
        }, 300)
    }

    async function handleEnviar(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await sendGmail({ to: correoDestinatario, ...form, adjuntos: files.length ? files : undefined })
            setEnviado(true)
        } catch {
            setError('No se pudo enviar el correo. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#0a1120] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
                            <h2 className="text-white font-bold text-base">
                                Contactar a {nombreDestinatario}
                            </h2>
                            <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {modo === 'elegir' && (
                                <OpcionesContacto
                                    whatsappNumber={whatsappNumber}
                                    onSelectGmail={() => setModo('gmail')}
                                />
                            )}

                            {modo === 'gmail' && !enviado && (
                                <FormularioCorreo
                                    form={form}
                                    files={files}
                                    loading={loading}
                                    error={error}
                                    onChange={(field, val) => setForm(p => ({ ...p, [field]: val }))}
                                    onFilesChange={setFiles}
                                    onSubmit={handleEnviar}
                                    onVolver={() => setModo('elegir')}
                                />
                            )}

                            {modo === 'gmail' && enviado && (
                                <EnvioExitoso
                                    nombreDestinatario={nombreDestinatario}
                                    onClose={handleClose}
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
