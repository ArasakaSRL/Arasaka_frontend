export function ProfesionalPreview() {
  return (
    <div className="h-40 bg-[#EFECE1] rounded-2xl border overflow-hidden p-3">

      <div className="h-full flex gap-3">

        <div className="w-1/3 bg-[#1B2A6D] rounded-r-3xl flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20" />
        </div>

        <div className="flex-1 flex flex-col gap-2">

          <div className="h-4 w-2/3 bg-white rounded mx-auto" />

          <div className="flex-1 bg-white rounded-xl p-2 space-y-2 border">
            <div className="h-2 bg-gray-100 rounded" />
            <div className="h-2 bg-gray-100 rounded" />
            <div className="h-2 bg-blue-100 rounded w-1/2" />
          </div>

          <div className="h-4 bg-white rounded-full border" />
        </div>

      </div>
    </div>
  );
}