import { CardCatalogo } from "@/features/plantillas/components/plantilla2/cards/CardCatalogo";
import type { ReactNode } from "react";

export interface CatalogoItem {
  id: string | number;
  izquierda: ReactNode;
  centro: ReactNode;
  derecha: ReactNode;
}

interface ListaCatalogoProps {
  items: CatalogoItem[];
  activeIndex: number;
  onItemClick: (index: number) => void;
}

export function ListaCatalogo({ items, activeIndex, onItemClick }: ListaCatalogoProps) {
  return (
    <div
      className="flex flex-col gap-3 w-full overflow-y-auto pr-1"
      style={{
        scrollbarWidth: "none",          
        msOverflowStyle: "none",         
      }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={item.id}
            className={`transition-all duration-300 cursor-pointer rounded-xl ${
              isActive
                ? "opacity-100 scale-[1.02]"
                : "opacity-70 hover:opacity-90 hover:scale-[1.01]"
            }`}
          >
            <CardCatalogo
              izquierda={item.izquierda}
              centro={item.centro}
              derecha={item.derecha}
              onClick={() => onItemClick(index)}
            />
          </div>
        );
      })}
    </div>
  );
}