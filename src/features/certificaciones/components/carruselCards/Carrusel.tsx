import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type CarouselProps = {
  children: React.ReactNode;
};

export function Carousel({ children }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const duplicatedChildren = [
    ...React.Children.toArray(children),
    ...React.Children.toArray(children),
  ];

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 250;

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => {
      const halfWidth = container.scrollWidth / 2;

      // Llegó al segundo bloque duplicado
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth;
      }

      // Llegó al inicio
      if (container.scrollLeft <= 0) {
        container.scrollLeft += halfWidth;
      }
    }, 300);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                   bg-black/50 hover:bg-black/70 text-white
                   px-3 py-2 rounded-md shadow transition"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overflow-y-visible scrollbar-hide px-10 py-6 min-h-[220px]"
      >
        {duplicatedChildren}
      </div>

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