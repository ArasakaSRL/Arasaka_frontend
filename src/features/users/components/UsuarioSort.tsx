import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  onSortAlphabetAsc: () => void;
  onSortAlphabetDesc: () => void;
  onSortNewest: () => void;
  onSortOldest: () => void;
}

type SortOption =
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "date-asc";

export const UserSort = ({
  onSortAlphabetAsc,
  onSortAlphabetDesc,
  onSortNewest,
  onSortOldest,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] =
    useState<SortOption>("name-asc");

  const menuRef = useRef<HTMLDivElement>(null);

  const labels = {
    "name-asc": "A - Z (Alfabético)",
    "name-desc": "Z - A (Alfabético)",
    "date-desc": "Últimos registrados",
    "date-asc": "Primeros registrados",
  };

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleSelect = (
    option: SortOption
  ) => {
    setSelected(option);
    setIsOpen(false);

    switch (option) {
      case "name-asc":
        onSortAlphabetAsc();
        break;

      case "name-desc":
        onSortAlphabetDesc();
        break;

      case "date-desc":
        onSortNewest();
        break;

      case "date-asc":
        onSortOldest();
        break;
    }
  };

  const options = [
    {
      id: "name-asc" as const,
      label: "A - Z (Alfabético)",
      desc: "Ordenar de A a Z por nombre",
    },
    {
      id: "name-desc" as const,
      label: "Z - A (Alfabético)",
      desc: "Ordenar de Z a A por nombre",
    },
    {
      id: "date-desc" as const,
      label: "Últimos registrados",
      desc: "Ver nuevos talentos primero",
    },
    {
      id: "date-asc" as const,
      label: "Primeros registrados",
      desc: "Ver los fundadores primero",
    },
  ];

  return (
    <div
      className="relative w-full md:w-64"
      ref={menuRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" w-full rounded-xl border border-gray-200 bg-white px-4 py-2 flex items-center justify-between text-sm font-medium hover:bg-gray-50 transition-colors
        "
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown
            size={16}
            className="text-[#16266B]"
          />

          <span>
            {labels[selected]}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -5,
            }}
            transition={{
              duration: 0.15,
            }}
            className=" absolute right-0 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden
            "
          >
            <div className="p-2 space-y-1">
              {options.map(option => (
                <button
                  key={option.id}
                  onClick={() =>
                    handleSelect(option.id)
                  }
                  className={` w-full text-left rounded-xl px-3 py-3 transition-all

                    ${
                      selected === option.id
                        ? "bg-[#16266B] text-white"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="font-semibold text-sm">
                    {option.label}
                  </div>

                  <div
                    className={`
                      text-xs mt-1

                      ${
                        selected === option.id
                          ? "text-blue-200"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};