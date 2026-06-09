import { Pencil, X, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
    icon: LucideIcon
    label: string
    value: string | null | undefined
    editing: boolean
    onStartEdit: () => void
    onCancel: () => void
    success?: boolean
    successText?: string
    editClassName?: string
    headerClassName?: string
    children: ReactNode
}

export default function EditableField({
    icon: Icon,
    label,
    value,
    editing,
    onStartEdit,
    onCancel,
    success,
    successText = 'Actualizado',
    editClassName = 'flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden',
    headerClassName = 'flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100',
    children,
}: Props) {
    return (
        <div className="flex flex-col gap-2">
            <AnimatePresence mode="wait">
                {!editing ? (
                    <motion.div
                        key="view"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-2 md:px-4 py-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                            <Icon size={20} className="text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                            <p className="text-sm text-slate-700 font-medium break-all">{value || '—'}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onStartEdit}
                            aria-label={`Editar ${label.toLowerCase()}`}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1e2a5e]/20 bg-[#1e2a5e]/5 text-[#1e2a5e] hover:bg-[#1e2a5e]/10 transition-colors shrink-0"
                        >
                            <Pencil size={16} className="text-slate-400" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className={editClassName}
                    >
                        <div className={headerClassName}>
                            <label className="text-[12px]! font-semibold text-slate-500 flex items-center gap-1.5">
                                <Icon size={16} className="text-slate-400" /> {label}
                            </label>
                            <button
                                type="button"
                                onClick={onCancel}
                                aria-label="Cancelar"
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="status"
                        aria-live="polite"
                        className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5"
                    >
                        <CheckCircle size={13} />
                        <p className="text-xs font-medium">{successText}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
