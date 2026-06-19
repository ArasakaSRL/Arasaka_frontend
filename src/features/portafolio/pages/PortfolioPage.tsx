import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Flag } from "lucide-react";

import { getPortafolioPublic } from "@/features/portafolio/lib/portafolio.service";
import DenunciarModal from "@/features/denuncias/components/DenunciarModal";

import Predeterminada from "@/features/plantillas/pages/Predeterminada";
import Plantilla1 from "@/features/plantillas/pages/Plantilla1";
import Plantilla2 from "@/features/plantillas/pages/Plantilla2";
import Plantilla3 from "@/features/plantillas/pages/Plantilla3";

export default function PortfolioPage() {
  const { slug } = useParams<{ slug: string }>();

  const [plantilla, setPlantilla] = useState<string | null>(null);
  const [idPortafolio, setIdPortafolio] = useState("");
  const [modalDenunciaAbierto, setModalDenunciaAbierto] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        const data = await getPortafolioPublic(slug);

        setIdPortafolio(data.id ?? "");
        setPlantilla(
          data.configuracion?.plantilla ??
            "predeterminado"
        );
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white">
        No se pudo cargar el portafolio
      </div>
    );
  }

  const renderPlantilla = () => {
    switch (plantilla ?? "predeterminado") {
      case "minimalista":
        return <Plantilla1 />;

      case "profesional":
        return <Plantilla2 />;

      case "stiloPastel":
        return <Plantilla3 />;

      case "predeterminado":
      default:
        return <Predeterminada />;
    }
  };

  return (
    <div className="relative">
      {renderPlantilla()}

      <button
        onClick={() => setModalDenunciaAbierto(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold rounded-full shadow-lg transition-colors"
      >
        <Flag size={14} />
        Denunciar
      </button>

      <DenunciarModal
        open={modalDenunciaAbierto}
        onClose={() => setModalDenunciaAbierto(false)}
        idPortafolio={idPortafolio}
      />
    </div>
  );
}