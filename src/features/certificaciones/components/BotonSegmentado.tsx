import { useState } from "react";
import { List, LayoutList, Grid2x2 } from "lucide-react";

type Vista = "grid" | "list" | "layout";

export default function BotonSegmentado() {
  const [active, setActive] = useState<Vista>("grid");

  const items = [
    {
      id: "grid",
      icon: Grid2x2,
    },
    {
      id: "layout",
      icon: LayoutList,
    },
    {
      id: "list",
      icon: List,
    },
  ] as const;

  return (
    <div className="inline-flex items-center rounded-2xl bg-white p-1 shadow-sm border border-gray-200">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`
              flex h-12 w-12 items-center justify-center
              rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }
            `}
          >
            <Icon size={22} strokeWidth={2.3} />
          </button>
        );
      })}
    </div>
  );
}