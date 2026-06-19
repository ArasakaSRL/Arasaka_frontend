interface RankingItem {
  titulo: string;
  cantidad: number;
}

interface Props {
  titulo?: string;
  items: RankingItem[];
  icono?: React.ReactNode;
}

const MEDALS = ["1", "2", "3"];

const CHIP_STYLES = [
  { bg: "#EEEDFE", color: "#3C3489" },
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FAEEDA", color: "#633806" },
  { bg: "#F1EFE8", color: "#444441" },
];

export default function TablaRanking({
  titulo = "Ranking",
  items,
  icono,
}: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {icono && (
            <span className="text-black text-[18px]">{icono}</span>
          )}
          <span className="text-[15px] font-medium text-slate-800">{titulo}</span>
        </div>
        {items.length > 0 && (
          <span className="text-[12px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
             
          </span>
        )}
      </div>

      {/* Column labels */}
      {items.length > 0 && (
        <div className="grid px-[18px] py-1.5" style={{ gridTemplateColumns: "28px 1fr auto", gap: "0 12px" }}>
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">#</span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">título</span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">cantidad</span>
        </div>
      )}

      {/* Rows */}
      <ul>
        {items.length === 0 && (
          <li className="px-[18px] py-8 text-center text-[13px] text-slate-400">
            Sin datos disponibles
          </li>
        )}

        {items.map((item, idx) => {
          const chip = CHIP_STYLES[idx] ?? CHIP_STYLES[CHIP_STYLES.length - 1];
          return (
            <li
              key={idx}
              className="grid items-center border-t border-slate-100 px-[18px] py-[11px] hover:bg-slate-50 transition-colors"
              style={{ gridTemplateColumns: "28px 1fr auto", gap: "0 12px" }}
            >
              {/* Posición */}
              <span className="text-center text-[13px] font-medium text-slate-400">
                {idx < 3 ? (
                  <span className="text-[16px]">{MEDALS[idx]}</span>
                ) : (
                  idx + 1
                )}
              </span>

              {/* Título */}
              <span className="text-[13px] text-slate-700 truncate">
                {item.titulo}
              </span>

              {/* Chip cantidad */}
              <span
                className="flex items-center gap-1.5 text-[13px] font-medium rounded-full px-2.5 py-[3px]"
                style={{ background: chip.bg, color: chip.color }}
              >
                {item.cantidad}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}