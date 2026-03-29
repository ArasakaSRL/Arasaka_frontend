type Props = {
  onDelete: () => void;
  onRotate: () => void;
  onCrop: () => void;
};

export function Toolbar({ onDelete, onRotate, onCrop }: Props) {
  return (
    <div className="flex flex-col gap-3 bg-gray-100 p-4 rounded-lg">
      <button onClick={onCrop}>✂️ Recortar</button>
      <button onClick={onRotate}>🔄 Rotar</button>
      <button onClick={onDelete}>🗑️ Eliminar</button>
    </div>
  );
}