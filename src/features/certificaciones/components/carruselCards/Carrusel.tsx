import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: React.ReactNode;
};

export function Carousel({ children }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 250;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      {/* Botón izquierda */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                   bg-black/50 hover:bg-black/70 text-white 
                   px-3 py-2 rounded-md shadow transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Contenedor */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-10"
      >
        {children}
      </div>

      {/* Botón derecha */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                   bg-black/50 hover:bg-black/70 text-white 
                   px-3 py-2 rounded-md shadow transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}