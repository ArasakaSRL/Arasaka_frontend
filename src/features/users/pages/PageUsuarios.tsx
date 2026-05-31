import DashboardLayout from '@/layout/DashboardLayout'
import { Banner } from '@/components/Banner'
import { useUsers } from '../hooks/useUsers'
import { UserSearch } from '../components/UsuariosBuscador'
import { UserList } from '../components/UsuarioList'

export default function PageUsuarios() {
  const { users, search, setSearch } = useUsers()

  return (
    <DashboardLayout>
      <Banner
      titulo="Usuarios"
      descripcion="Gestiona tus usuarios"
      />
      <section className="mt-8 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <UserSearch value={search} onChange={setSearch} />
        </div>
        <UserList users={users} />
      </section>
    </DashboardLayout>
  )
}