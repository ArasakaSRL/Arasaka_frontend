type CategoryCardProps = {
  title: string;
  description: string;
  image: string;
};

export function CategoriaCard({ title, description, image }: CategoryCardProps) {
  return (
    <div className="relative w-56 h-72 rounded-xl overflow-hidden shadow-lg group cursor-pointer">
      
      {/* Imagen de fondo */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Contenido */}
      <div className="absolute bottom-0 p-4 text-white">
        <p className="text-xs text-light-500 opacity-80">{description}</p>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {/* Hover efecto (opcional) */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
    </div>
  );
}