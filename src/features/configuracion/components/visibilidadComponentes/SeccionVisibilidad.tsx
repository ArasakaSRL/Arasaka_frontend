import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { useState } from "react";

type SeccionVisibilidadProps = {
  titulo: string;
  children: React.ReactNode;
  maxHeight?: string;
  forceScroll?: boolean;
};

export function SeccionVisibilidad({
  titulo,
  children,
  maxHeight = "50vh",
  forceScroll = false, 
}: SeccionVisibilidadProps) {

  const [visible, setVisible] = useState(true);

  const items = Array.isArray(children) ? children : [children];
  const isFew = items.length <= 3;
  const shouldScroll = forceScroll || !isFew;


  const childrenWithProps = items.map((child) => {
    if (React.isValidElement<{ disabled?: boolean }>(child)) {
      return React.cloneElement(child, {
        disabled: !visible,
      });
    }
    return child;
  });

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-base text-black md:text-lg font-semibold">
          {titulo}
        </h2>

        <button onClick={() => setVisible(!visible)}>
          {visible ? (
            <Eye className="w-5 h-5 text-gray-500 cursor-pointer" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" />
          )}
        </button>
      </div>

      {/* CONTENIDO */}
      <div
        className={`
          ${shouldScroll ? "overflow-y-auto custom-scroll" : ""}
          pr-2
        `}
        style={{ maxHeight: shouldScroll ? maxHeight : "none" }}
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
          {childrenWithProps}
        </div>
      </div>

    </div>
  );
}