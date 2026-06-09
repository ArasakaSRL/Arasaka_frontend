export function MinimalistaPreview() {
  return (
    <div className="h-40 bg-white rounded-2xl border p-3">
      <div className="h-full grid grid-cols-3 gap-2">

        <div className="bg-gray-50 rounded-xl border flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="w-10 h-1 bg-gray-300 rounded" />
          <div className="w-12 h-2 bg-blue-100 rounded" />
        </div>

        <div className="col-span-2 flex flex-col gap-2">

          <div className="h-5 rounded bg-gray-100 flex items-center gap-1 px-2">
            <div className="w-4 h-1 rounded bg-blue-500" />
            <div className="w-4 h-1 rounded bg-gray-300" />
            <div className="w-4 h-1 rounded bg-gray-300" />
          </div>

          <div className="flex-1 rounded-xl border bg-gray-50" />
        </div>

      </div>
    </div>
  );
}