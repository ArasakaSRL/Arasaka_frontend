import type { LucideIcon } from "lucide-react";


interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function BotonPerfil({
  label,
  icon: Icon,
  onClick,
  variant = "primary",
}: ActionButtonProps) {
  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
    secondary:
      "bg-gray-100 text-blue-600 hover:bg-gray-200 border-gray-200",
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full
        h-12
        rounded-full
        border
        flex
        items-center
        justify-center
        gap-2
        font-semibold
        transition-colors
        ${styles[variant]}
      `}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}