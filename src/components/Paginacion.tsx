import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Paginacion({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className=" flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
        "
      >
        <ChevronLeft size={16} />
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        )
          .filter(
            n =>
              n === 1 ||
              n === totalPages ||
              Math.abs(n - currentPage) <= 1
          )
          .reduce<(number | "…")[]>(
            (acc, n, idx, arr) => {
              if (
                idx > 0 &&
                n - (arr[idx - 1] as number) > 1
              ) {
                acc.push("…");
              }

              acc.push(n);

              return acc;
            },
            []
          )
          .map((item, idx) =>
            item === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 text-gray-400 text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() =>
                  onPageChange(item as number)
                }
                className={` w-9 h-9 text-sm font-medium rounded-xl transition-colors
                  ${
                    currentPage === item
                      ? "bg-[#1e2a5e] text-white"
                      : "text-slate-600 hover:bg-gray-100"
                  }
                `}
              >
                {item}
              </button>
            )
          )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className=" flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        Siguiente
        <ChevronRight size={16} />
      </button>
    </div>
  );
}