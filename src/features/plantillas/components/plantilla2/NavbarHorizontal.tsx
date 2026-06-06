import { motion } from "framer-motion";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";

type Props = {
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function NavbarHorizontal({
  activeIndex,
  onChange,
}: Props) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        p-2
        rounded-full
        bg-white/10
        backdrop-blur-xl
        border
        border-white/10
      "
    >
      {ORBITA_ITEMS.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onChange(index)}
          className="
            relative
            px-3
            py-3
            rounded-full
            text-sm
            font-semibold
            transition-colors
          "
        >
          {activeIndex === index && (
            <motion.div
              layoutId="active-section"
              className="absolute inset-0 rounded-full bg-white"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          )}

          <span
            className={`relative z-10 ${
              activeIndex === index
                ? "text-slate-900"
                : "text-slate-400"
            }`}
          >
            {item.titulo}
          </span>
        </button>
      ))}
    </div>
  );
}