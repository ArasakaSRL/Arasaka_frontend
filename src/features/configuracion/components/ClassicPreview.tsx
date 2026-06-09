export function ClassicPreview() {
  return (
    <div className="h-40 bg-white rounded-2xl border overflow-hidden">
      <div className="h-10 bg-[#0D2347] flex items-center justify-center">
        <div className="w-8 h-2 bg-white/30 rounded-full" />
      </div>

      <div className="p-3 space-y-3">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto" />

        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="h-2 bg-gray-100 rounded w-2/3 mx-auto" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 rounded bg-gray-100" />
          <div className="h-8 rounded bg-gray-100" />
          <div className="h-8 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}