export function PastelPreview() {
  return (
    <div className="h-40 bg-[#FFF5F8] rounded-2xl border-2 border-black overflow-hidden p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">

      <div className="space-y-3">

        <div className="h-10 rounded-2xl border-2 border-black bg-[#E3F2FD] flex items-center gap-2 px-2">
          <div className="w-5 h-5 rounded-full bg-pink-300 border border-black" />
          <div className="h-2 w-12 bg-black/20 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-2">

          <div className="h-10 rounded-xl border-2 border-black bg-white" />

          <div className="h-10 rounded-xl border-2 border-black bg-white" />
        </div>

        <div className="h-10 rounded-xl border-2 border-black bg-white flex items-center px-2">
          <div className="h-2 w-full rounded-full bg-pink-200 overflow-hidden">
            <div className="h-full w-2/3 bg-pink-400" />
          </div>
        </div>

      </div>
    </div>
  );
}