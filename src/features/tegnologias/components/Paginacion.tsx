import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Props = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

export const Paginacion = ({
  currentPage,
  lastPage,
  onPageChange,
}: Props) => {
  return (
    <div
      className="
      flex
      items-center
      justify-center
      gap-4
      py-8
    "
    >
      <button
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        className="
        border
        rounded-xl
        p-2
        disabled:opacity-40
      "
      >
        <ChevronLeft />
      </button>

      <span className="font-medium">
        Página {currentPage} de {lastPage}
      </span>

      <button
        disabled={currentPage === lastPage}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="
        border
        rounded-xl
        p-2
        disabled:opacity-40
      "
      >
        <ChevronRight />
      </button>
    </div>
  );
};