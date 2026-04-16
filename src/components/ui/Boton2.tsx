type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean; // 👈 agregar esto
};

export function Boton2({ children, onClick, className, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium-ui transition
        ${disabled ? "opacity-50 cursor-not-allowed hover:bg-primary-500" : ""}
        ${className || ""}
      `}
    >
      {children}
    </button>
  );
}