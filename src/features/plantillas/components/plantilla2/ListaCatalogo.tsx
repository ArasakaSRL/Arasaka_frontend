import { CardCatalogo } from "@/features/plantillas/components/plantilla2/cards/CardCatalogo";
import type { ReactNode } from "react";

export interface CatalogoItem {
  id: string | number;
  titulo: string;
  descripcion: string;
  detalle?: string;
  imagen?: ReactNode | string;
  indexLabel?: string;
}

interface ListaCatalogoProps {
  items: CatalogoItem[];
  activeIndex: number;
  onItemClick: (index: number) => void;
}

export function ListaCatalogo({ items, activeIndex, onItemClick }: ListaCatalogoProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={item.id}
            className={`transition-all duration-300 cursor-pointer rounded-xl relative ${
              isActive 
                ? "z-10 opacity-100 scale-[1.02] drop-shadow-xl" 
                : "z-0 opacity-60 hover:opacity-85 hover:scale-[1.01] hover:drop-shadow-md hover:z-10"
            }`}
          >
            <CardCatalogo
              titulo={item.titulo}
              descripcion={item.descripcion}
              detalle={item.detalle}
              imagen={item.imagen}
              indexLabel={item.indexLabel}
              onClick={() => onItemClick(index)}
            />
          </div>
        );
      })}
    </div>
  );
}