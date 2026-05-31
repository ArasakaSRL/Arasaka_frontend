import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}