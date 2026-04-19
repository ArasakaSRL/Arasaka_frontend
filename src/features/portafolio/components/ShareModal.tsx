import { useEffect, useState } from "react";
import { X, Copy, Check, RefreshCw, Link as LinkIcon } from "lucide-react";
import {
    generarLinkPortafolio,
    obtenerLinkPortafolio,
    type DuracionLink,
    type LinkPortafolio,
} from "../lib/share.service";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
}

const DURACIONES: { value: DuracionLink; label: string }[] = [
    { value: "semana", label: "1 semana" },
    { value: "mes", label: "1 mes" },
    { value: "anio", label: "1 año" },
    { value: "sin_limite", label: "Sin límite" },
];

type Estado = "idle" | "cargando" | "exito" | "error";

export default function ShareModal({ open, onClose }: ShareModalProps) {
    const [link, setLink] = useState<LinkPortafolio | null>(null);
    const [estado, setEstado] = useState<Estado>("idle");
    const [duracion, setDuracion] = useState<DuracionLink>("mes");
    const [copiado, setCopiado] = useState(false);
    const [mostrarSelectorDuracion, setMostrarSelectorDuracion] = useState(false);

    useEffect(() => {
        if (!open) return;

        let activo = true;
        setEstado("cargando");
        obtenerLinkPortafolio()
            .then((data) => {
                if (!activo) return;
                setLink(data);
                if (data.link_activo && data.url) {
                    setEstado("exito");
                    if (data.duracion) setDuracion(data.duracion);
                } else {
                    setEstado("idle");
                    setMostrarSelectorDuracion(true);
                }
            })
            .catch(() => {
                if (!activo) return;
                setLink(null);
                setEstado("idle");
                setMostrarSelectorDuracion(true);
            });

        return () => {
            activo = false;
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            setCopiado(false);
            setMostrarSelectorDuracion(false);
        }
    }, [open]);

    const handleGenerar = async () => {
        setEstado("cargando");
        try {
            const data = await generarLinkPortafolio(duracion);
            setLink(data);
            setEstado("exito");
            setMostrarSelectorDuracion(false);
        } catch {
            setEstado("error");
        }
    };

    const handleCopiar = async () => {
        if (!link?.url) return;
        try {
            await navigator.clipboard.writeText(link.url);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = link.url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    const compartirEn = (plataforma: "whatsapp" | "facebook" | "twitter" | "linkedin" | "telegram" | "email") => {
        if (!link?.url) return;
        const url = encodeURIComponent(link.url);
        const texto = encodeURIComponent("Mira mi portafolio profesional");

        const urls: Record<string, string> = {
            whatsapp: `https://wa.me/?text=${texto}%20${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${texto}&url=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${texto}`,
            email: `mailto:?subject=${texto}&body=${url}`,
        };

        window.open(urls[plataforma], "_blank", "noopener,noreferrer");
    };

    if (!open) return null;

    const mostrarFormulario =
        mostrarSelectorDuracion || !link?.link_activo || estado === "error";

    return ( 
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <LinkIcon size={20} className="text-[#1e2a5e]" />
                        <h2 className="text-lg font-semibold text-slate-800">Compartir portafolio</h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {mostrarFormulario && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tiempo de funcionamiento del link
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {DURACIONES.map((d) => (
                                    <button
                                        key={d.value}
                                        type="button"
                                        onClick={() => setDuracion(d.value)}
                                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                            duracion === d.value
                                                ? "bg-[#1e2a5e] text-white border-[#1e2a5e]"
                                                : "bg-white text-slate-700 border-gray-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Enlace público
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 relative">
                                <input
                                    readOnly
                                    value={
                                        estado === "error"
                                            ? "Ocurrió un error al generar el link"
                                            : estado === "cargando"
                                            ? "Generando..."
                                            : link?.url ?? ""
                                    }
                                    placeholder="Aún no has generado un link"
                                    className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50 focus:outline-none ${
                                        estado === "error"
                                            ? "border-red-300 text-red-600"
                                            : "border-gray-200 text-slate-700"
                                    }`}
                                />
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={handleCopiar}
                                    disabled={!link?.url || estado !== "exito"}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-[#1e2a5e] text-white rounded-lg text-sm font-medium hover:bg-[#2c3a7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {copiado ? <Check size={16} /> : <Copy size={16} />}
                                    <span>{copiado ? "Copiado" : "Copiar"}</span>
                                </button>
                                {copiado && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                        Copiado a portapapeles
                                    </div>
                                )}
                            </div>
                        </div>

                        {estado === "exito" && (
                            <p className="mt-2 text-sm text-green-600 font-medium">
                                Link generado con éxito
                            </p>
                        )}
                        {estado === "error" && (
                            <button
                                type="button"
                                onClick={handleGenerar}
                                className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e2a5e] font-medium hover:underline"
                            >
                                <RefreshCw size={14} /> Reintentar
                            </button>
                        )}
                    </div>

                    {estado === "exito" && link?.url && !mostrarSelectorDuracion && (
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-2">Compartir en</p>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                <SocialBtn label="WhatsApp" onClick={() => compartirEn("whatsapp")} color="#25D366" />
                                <SocialBtn label="Facebook" onClick={() => compartirEn("facebook")} color="#1877F2" />
                                <SocialBtn label="X" onClick={() => compartirEn("twitter")} color="#000000" />
                                <SocialBtn label="LinkedIn" onClick={() => compartirEn("linkedin")} color="#0A66C2" />
                                <SocialBtn label="Telegram" onClick={() => compartirEn("telegram")} color="#229ED9" />
                                <SocialBtn label="Email" onClick={() => compartirEn("email")} color="#64748b" />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                        {mostrarFormulario ? (
                            <button
                                type="button"
                                onClick={handleGenerar}
                                disabled={estado === "cargando"}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1e2a5e] text-white rounded-lg text-sm font-medium hover:bg-[#2c3a7a] disabled:opacity-50 transition-colors"
                            >
                                <LinkIcon size={16} />
                                {estado === "cargando" ? "Generando..." : "Generar link"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setMostrarSelectorDuracion(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                                <RefreshCw size={16} />
                                Generar nuevo link
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors"
        >
            <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}
            >
                {label.charAt(0)}
            </span>
            <span className="text-[11px] text-slate-600">{label}</span>
        </button>
    );
}
