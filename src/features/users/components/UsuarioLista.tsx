import type { Usuario } from "../lib/UserApi";

interface Props {
  users: Usuario[];
}

export const UserList = ({ users }: Props) => {
  
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-600 uppercase text-xs tracking-wide">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Correo Electronico</th>
              <th className="px-6 py-4 text-center">Portafolios</th>
              <th className="px-6 py-4">Miembro desde</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const iniciales = [
                user.nombre?.charAt(0),
                user.apellido?.charAt(0),
              ]
                .filter(Boolean)
                .join("");

              return (
                <tr
                  key={user.id_usuario}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition-colors text-left"
                >
                  {/* Usuario */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.url_foto ? (
                        <img
                          src={user.url_foto}
                          alt={user.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#16266B] text-white flex items-center justify-center font-semibold">
                          {iniciales}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.nombre} {user.apellido}
                        </p>

                        <p className="text-xs text-gray-500 text-left">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.rol === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.rol === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </td>

                  {/* Correo */}
                  <td className="px-6 py-4 text-gray-600">
                    {user.correo}
                  </td>

                  {/* Portafolios */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-lg bg-gray-100 font-medium">
                      {user.portafolios.length}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.created_at).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Activo
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};