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
   <nav
    className="
      flex items-center gap-7 p-1.5
      rounded-2xl
      bg-white/70
      backdrop-blur-xl
      border border-black/8
      shadow-[0_2px_12px_rgba(0,0,0,0.07)]
    "
  >
      {ORBITA_ITEMS.map((item, index) => {
        const isActive = activeIndex === index;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onChange(index)}
            title={item.titulo}
            className="
              relative
              w-12 h-12
              flex items-center justify-center
              rounded-xl
              transition-colors duration-200
            "
          >
            {/* Pill activa */}
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-active-from), var(--color-active-to))",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                }}
              />
            )}

            {/* Icono */}
            <span className="relative z-10 flex items-center justify-center">
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-black"
                    : "text-black/60"
                }
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
}