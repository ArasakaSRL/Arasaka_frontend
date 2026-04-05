
export default function HabilidadesList() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* tecnicas */}
      <div className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold text-black mb-2 text-left">Habilidades Técnicas</h3>
        <h2 className="text-xs text-gray-600 mb-4 text-left">Lenguajes, frameworks, herramientas, etc.</h2>
        <div className="space-y-3">
        </div>
      </div>

      {/* blandas */}
      <div className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold text-black mb-2 text-left">Habilidades Blandas</h3>
        <h2 className="text-xs text-gray-600 mb-4 text-left">Habilidades sociales, comunicativas y de trabajo en equipo</h2>
        <div className="space-y-3">
        </div>
      </div>
    </div>
  );
}