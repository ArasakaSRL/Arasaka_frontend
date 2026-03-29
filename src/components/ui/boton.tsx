type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Boton({ children, onClick }: Props) {
  return (
    <button onClick={onClick} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium-ui transition">
      {children}
    </button>
  )
}