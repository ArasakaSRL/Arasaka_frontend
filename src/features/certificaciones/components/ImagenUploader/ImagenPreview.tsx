type Props = {
  src: string;
};

export function ImagenPreview({ src }: Props) {
  return (
    <div className="bg-black p-4 rounded-lg">
      <img src={src} className="max-w-md rounded" />
    </div>
  );
}