import { Briefcase, Award } from "lucide-react";

interface TimelineItem {
  id: string;
  fecha: string;
  titulo: string;
  subtitulo: string;
  tipo: "experiencia" | "certificacion";
}

interface Props {
  items: TimelineItem[];
}

export function Timeline({ items }: Props) {
  return (
    <div className="flex items-center gap-4 min-w-max py-6 px-2">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center">
          <div className="w-72 bg-white border rounded-xl shadow-sm p-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                {item.tipo === "experiencia" ? (
                  <Briefcase size={16} />
                ) : (
                  <Award size={16} />
                )}
              </div>

              <span className="text-xs text-slate-500">
                {new Date(item.fecha).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-semibold text-slate-800">
              {item.titulo}
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              {item.subtitulo}
            </p>
          </div>

          {index < items.length - 1 && (
            <div className="w-20 h-1 bg-slate-300 mx-2 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}