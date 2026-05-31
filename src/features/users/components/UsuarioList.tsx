import type { User }from '../utils/users.mocks'
import { UsuarioCard } from './UsuarioCard'

interface Props {
  users: User[]
}

export const UserList = ({ users }: Props) => {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 " >
      {users.map(user => (
        <UsuarioCard
          key={user.id}
          user={user}
        />
      ))}
    </div>
  )
}
