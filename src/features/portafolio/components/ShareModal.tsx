import { useEffect, useState } from "react";
import { X, Copy, Check, RefreshCw, Link as LinkIcon } from "lucide-react";
import {
    generarLinkPortafolio,
    obtenerLinkPortafolio,
    type LinkPortafolio,
} from "../lib/share.service";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
}

type Estado = "idle" | "cargando" | "exito" | "error";

export default function ShareModal({ open, onClose }: ShareModalProps) {
    const [link, setLink] = useState<LinkPortafolio | null>(null);
    const [estado, setEstado] = useState<Estado>("idle");
    const [copiado, setCopiado] = useState(false);

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
                } else {
                    setEstado("idle");
                }
            })
            .catch(() => {
                if (!activo) return;
                setLink(null);
                setEstado("idle");
            });

        return () => {
            activo = false;
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            setCopiado(false);
        }
    }, [open]);

    const handleGenerar = async () => {
        setEstado("cargando");
        try {
            const data = await generarLinkPortafolio();
            setLink(data);
            setEstado("exito");
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

    const compartirEn = (
        plataforma: "whatsapp" | "facebook" | "twitter" | "linkedin" | "telegram" | "email"
    ) => {
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
                        <h2 className="text-lg font-semibold text-slate-800">
                            Compartir portafolio
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Enlace público
                        </label>

                        <div className="flex flex-col sm:flex-row gap-2">
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
                                className="flex-1 px-3 py-2 text-sm rounded-lg border bg-slate-50"
                            />

                            <button
                                onClick={handleCopiar}
                                disabled={!link?.url || estado !== "exito"}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-[#1e2a5e] text-white rounded-lg text-sm disabled:opacity-50"
                            >
                                {copiado ? <Check size={16} /> : <Copy size={16} />}
                                {copiado ? "Copiado" : "Copiar"}
                            </button>
                        </div>
                    </div>

                    {estado === "exito" && link?.url && (

                        <div >
                            <div className="flex items-center justify-center gap-1">
                                <Check size={14} />
                                <p className="text-sm text-center text-green-600">
                                    
                                    Link generado con éxito
                                </p>

                            </div>


                            <p className="text-sm font-medium text-slate-700 mb-2">
                                Compartir en
                            </p>
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

                    {estado === "error" ? (
                        <button
                            onClick={handleGenerar}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                        >
                            <RefreshCw size={16} />
                            Reintentar
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerar}
                            disabled={estado === "cargando"}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1e2a5e] text-white rounded-lg text-sm disabled:opacity-50"
                        >
                            <RefreshCw size={16} />
                            {estado === "cargando"
                                ? "Generando..."
                                : link?.url
                                ? "Regenerar link"
                                : "Generar link"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function SocialBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg border hover:bg-slate-50"
        >
            <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: color }}
            >
                {label.charAt(0)}
            </span>
            <span className="text-[11px] text-slate-600">{label}</span>
        </button>
    );
}