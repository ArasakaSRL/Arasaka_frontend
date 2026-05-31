import { useMemo, useState } from 'react'
import { usersMock } from '../utils/users.mocks'
import { filterUsers } from '../utils/filtroUsuarios'

export const useUsers = () => {
  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(() => {
    return filterUsers(usersMock, search)
  }, [search])

  return {
    users: filteredUsers,
    search,
    setSearch,
  }
}