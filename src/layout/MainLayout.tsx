import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Outlet />
    </div>
  )
}