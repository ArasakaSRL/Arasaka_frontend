import { useEffect, useState } from "react";
import { Banner } from "@/components/Banner";
import { TecnologiaModal } from "@/features/tegnologias/components/TecnologiaModal";
import { TecnologiaCard } from "@/features/tegnologias/components/TecnologiaCard";
import { Paginacion } from "@/features/tegnologias/components/Paginacion";
import { getTecnologias } from "../lib/tegnologia.service";
import DashboardLayout from "@/layout/DashboardLayout";
import type {
  Tecnologia,
  TecnologiaResponse,
} from "@/features/tegnologias/types/tecnologia.types";

function TecnologiaPage() {
  const [open, setOpen] = useState(false);
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

const obtenerTecnologias = async (pagina = 1) => {
  try {
    setLoading(true);

    const response = await getTecnologias(pagina);
    setTecnologias(response.data);
    setPagination(response.pagination);
    setPage(response.pagination.current_page);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    obtenerTecnologias();
  }, []);

  return (
     <DashboardLayout>
     
      <Banner
        titulo="Tecnologías"
        descripcion="Explora las tecnologías que dominamos y cómo las aplicamos en nuestros proyectos."
        onAgregar={() => setOpen(true)}
      />
      <div className="p-5">
      <TecnologiaModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => obtenerTecnologias(page)}
      />

      {loading ? (
        <div className="text-center py-20">
          Cargando tecnologías...
        </div>
      ) : (
        <>
          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-5
          "
          >
            {tecnologias.map((tecnologia) => (
              <TecnologiaCard
                key={tecnologia.id_tecnologia}
                tecnologia={tecnologia}
              />
            ))}
          </div>

          <Paginacion
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            onPageChange={(pagina) => {
              obtenerTecnologias(pagina);
            }}
          />
        </>
      )}
    </div>
  </DashboardLayout>
  );
}

export default TecnologiaPage;