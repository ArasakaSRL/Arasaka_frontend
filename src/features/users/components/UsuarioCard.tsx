import type {User} from '../utils/users.mocks'
import {Mail} from "lucide-react"

interface Props {
  user: User
}

export const UsuarioCard = ({ user }: Props) => {
  return (
        <article
      className="
      bg-white
      rounded-3xl
      p-8
      shadow-sm
      border
      border-gray-100
    "
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.nombre}
              className="
                w-24
                h-24
                rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-[#16266B] text-white flex items-center justify-center text-3xl font-bold
            "
            >
              {user.nombre
                .split(' ')
                .map(word => word[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}

          <span
            className={`absolutebottom-0right-0w-5h-5rounded-fullborder-2border-white
              ${
                user.online
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }
            `}
          />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-center">
          {user.nombre}
        </h3>

        <p className="text-[#16266B] font-medium">
          @{user.username}
        </p>

        <div className="flex items-center gap-2 mt-2 text-gray-500">
          <Mail size={15} />
          <span>{user.email}</span>
        </div>

        <button className=" mt-8 w-full bg-gray-100 hover:bg-gray-200 transition rounded-xl py-3 font-medium">
          Ver Portafolio
        </button>
      </div>
    </article>
  )
}