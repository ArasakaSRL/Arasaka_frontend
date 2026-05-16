import { List, LayoutList, Grid2x2 } from "lucide-react";

export type Vista =
  | "cards"
  | "hibrido"
  | "detalles";

type Props = {
  vista: Vista;
  onChange: (vista: Vista) => void;
};

export default function BotonSegmentado({
  vista,
  onChange,
}: Props) {

  const items = [
    {
      id: "cards",
      icon: Grid2x2,
    },
    {
      id: "hibrido",
      icon: LayoutList,
    },
    {
      id: "detalles",
      icon: List,
    },
  ] as const;

  return (
    <div
      className="
        inline-flex
        items-center
        rounded-2xl
        bg-white
        p-1
        shadow-sm
        border border-gray-200
      "
    >
      {items.map((item) => {

        const Icon = item.icon;

        const isActive =
          vista === item.id;

        return (
          <button
            key={item.id}
            onClick={() =>
              onChange(item.id)
            }
            className={`
              flex h-12 w-12
              items-center justify-center
              rounded-xl
              transition-all duration-200
              ${
                isActive
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }
            `}
          >
            <Icon
              size={22}
              strokeWidth={2.3}
            />
          </button>
        );
      })}
    </div>
  );
}