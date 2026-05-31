import type { User } from '../utils/users.mocks'

export const filterUsers = (
  users: User[],
  search: string
): User[] => {
  if (!search.trim()) return users

  const term = search.toLowerCase()

  return users.filter(
    user =>
      user.nombre.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term)
  )
}