export interface User {
  id: number
  nombre: string
  username: string
  email: string
  avatar?: string
  online: boolean
}

export const usersMock: User[] = [
  {
    id: 1,
    nombre: 'Giuliana Quispe Salazar',
    username: 'giuli.dev',
    email: 'giuliana@devlinked.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    online: true,
  },
  {
    id: 2,
    nombre: 'Marco Fernandez',
    username: 'mfernandez_99',
    email: 'marco@gmail.com',
    avatar: '',
    online: true,
  },
  {
    id: 3,
    nombre: 'Juan Perez',
    username: 'juanperez',
    email: 'juan@gmail.com',
    avatar: '',
    online: false,
  },
  {
    id: 4,
    nombre: 'Ana Lopez',
    username: 'analopez',
    email: 'ana@gmail.com',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    online: true,
  },
]