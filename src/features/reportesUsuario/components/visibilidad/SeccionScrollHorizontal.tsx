"use client";

import React from "react";

type Props = {
  titulo: string;
  children: React.ReactNode;
  height?: string;
};

export function SeccionScrollHorizontal({
  titulo,
  children,
  height = "320px",
}: Props) {
  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold text-black">
          {titulo}
        </h2>
      </div>

      {/* CONTENEDOR SCROLL */}
      <div
        className="overflow-x-auto custom-scroll"
        style={{
          height,
          WebkitOverflowScrolling: "touch", 
          touchAction: "pan-x",             
        }}
      >
        <div className="flex gap-6 min-w-max px-2">

          {React.Children.map(children, (child, i) => (
            <div key={i} className="flex-shrink-0">
              {child}
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}