interface InfoItemProps {
  icon: React.ReactNode;
  text: string;
}

export function InfoItem({
  icon,
  text,
}: InfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500">
        {icon}
      </span>

      <span className="text-sm">
        {text}
      </span>
    </div>
  );
}