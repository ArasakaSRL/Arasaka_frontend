type Props = {
  children: React.ReactNode
}

export const Boton = ({ children }: Props) => {
  return (
    <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium-ui transition">
      {children}
    </button>
  )
}