import { useState } from "react";

import BotonSegmentado, {
  type Vista,
} from "./BotonSegmentado";

import { CertificadosGrid } from "./gridsCertificados/CertificadosGrid";
import { GridDetalles } from "./gridsCertificados/GridDetalles";
import { GridHibrido } from "./gridsCertificados/GridHibrido";

import type { Certificado } from "./ordenarCards/CertificadoCard";

type Props = {
  certificados: Certificado[];

  modoAccion:
    | "editar"
    | "eliminar"
    | null;

  certificadosEliminar: string[];

  onEliminar: (
    cert: Certificado
  ) => void;
};

export function SeccionCertificados({
  certificados,
  modoAccion,
  certificadosEliminar,
  onEliminar,
}: Props) {

  const [vista, setVista] =
    useState<Vista>("cards");

  return (
    <div className="space-y-6">

      {/* ───────── HEADER ───────── */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          flex-wrap
        "
      >

        {/* TITULO */}
        <h3
          className="
            text-2xl
            text-dark-500
            font-medium-ui
          "
        >
          Certificados
        </h3>

        {/* BOTON SEGMENTADO */}
        <BotonSegmentado
          vista={vista}
          onChange={setVista}
        />

      </div>

      {/* ───────── CONTENIDO ───────── */}

      {vista === "cards" && (
        <CertificadosGrid
          certificados={certificados}
          modoAccion={modoAccion}
          certificadosEliminar={
            certificadosEliminar
          }
          onEliminar={onEliminar}
        />
      )}

      {vista === "hibrido" && (
        <GridHibrido
          certificados={certificados}
        />
      )}

      {vista === "detalles" && (
        <GridDetalles
          certificados={certificados.map(
            (cert) => ({
              id: cert.id,
              titulo: cert.titulo,
              descripcion: "",
              institucion: "",
              fecha: "",
              categoria: "",
            })
          )}
        />
      )}

    </div>
  );
}